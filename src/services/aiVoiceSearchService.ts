import { Book, FormatType, AiVoiceSearchResult } from '../types';

export async function processAiVoiceSearch(
  transcript: string, 
  catalog: Book[]
): Promise<AiVoiceSearchResult> {
  const cleanTranscript = transcript.trim();
  if (!cleanTranscript) {
    return {
      recognizedIntent: 'general',
      cleanSearchQuery: '',
      voiceAnswerSummary: 'Please speak a title, format, or topic to search Knowledge Centa.',
      matchingBookIds: [],
      suggestedFollowUps: ['Show me silk woven editions', 'Audiobooks by Johnny Blue', 'Raw manuscript scans'],
      confidenceScore: 0.1
    };
  }

  // 1. Attempt Server-Side Gemini AI Voice Query Interpretation
  try {
    const response = await fetch('/api/ai/voice-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        spokenQuery: cleanTranscript,
        catalogTitles: catalog.map(b => ({ id: b.id, title: b.title, author: b.author, category: b.category }))
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.result) {
        // Find matching book IDs based on Gemini's extracted parameters
        const matched = filterCatalogByAiParams(catalog, data.result);
        return {
          ...data.result,
          matchingBookIds: matched.length ? matched.map(b => b.id) : catalog.slice(0, 3).map(b => b.id)
        };
      }
    }
  } catch (err) {
    console.warn('AI Voice Search server endpoint error, using client-side semantic parser:', err);
  }

  // 2. High-Performance Client-Side Semantic Parser (Resilient & Offline-Ready)
  return parseSpokenQueryLocally(cleanTranscript, catalog);
}

function parseSpokenQueryLocally(transcript: string, catalog: Book[]): AiVoiceSearchResult {
  const lower = transcript.toLowerCase();
  
  // Detect format & dimension
  let detectedFormat: FormatType | undefined = undefined;
  let detectedDimensionNumber: number | undefined = undefined;

  if (lower.includes('silk') || lower.includes('cotton') || lower.includes('woven') || lower.includes('textile')) {
    detectedFormat = 'silk_cotton';
    detectedDimensionNumber = 9;
  } else if (lower.includes('raw') || lower.includes('handwritten') || lower.includes('manuscript') || lower.includes('scan') || lower.includes('notebook')) {
    detectedFormat = 'manuscript';
    detectedDimensionNumber = 4;
  } else if (lower.includes('audio') || lower.includes('listen') || lower.includes('narrat') || lower.includes('voice')) {
    detectedFormat = 'audiobook';
    detectedDimensionNumber = 2;
  } else if (lower.includes('video') || lower.includes('4k') || lower.includes('cinematic') || lower.includes('visual')) {
    detectedFormat = 'videobook';
    detectedDimensionNumber = 3;
  } else if (lower.includes('hardcover') || lower.includes('clothbound') || lower.includes('foil')) {
    detectedFormat = 'hardcover';
    detectedDimensionNumber = 5;
  } else if (lower.includes('paperback') || lower.includes('paper cover') || lower.includes('softcover')) {
    detectedFormat = 'papercover';
    detectedDimensionNumber = 6;
  } else if (lower.includes('pendrive') || lower.includes('usb') || lower.includes('sd card') || lower.includes('flash drive')) {
    detectedFormat = 'pendrive_sd';
    detectedDimensionNumber = 7;
  } else if (lower.includes('soundtrack') || lower.includes('music') || lower.includes('album') || lower.includes('flac') || lower.includes('score')) {
    detectedFormat = 'musical_album';
    detectedDimensionNumber = 8;
  } else if (lower.includes('device') || lower.includes('e-ink') || lower.includes('eink') || lower.includes('hardware') || lower.includes('slab')) {
    detectedFormat = 'digital_device';
    detectedDimensionNumber = 10;
  } else if (lower.includes('ebook') || lower.includes('epub') || lower.includes('pdf')) {
    detectedFormat = 'ebook';
    detectedDimensionNumber = 1;
  }

  // Detect Max Price constraints
  let maxPrice: number | undefined = undefined;
  const priceMatch = lower.match(/(?:under|less than|below|cheaper than|max)\s*(?:\$)?\s*(\d+(?:\.\d+)?)/i) ||
                     lower.match(/(?:\$)?\s*(\d+(?:\.\d+)?)\s*(?:dollars|bucks)?/i);
  if (priceMatch && (lower.includes('under') || lower.includes('less') || lower.includes('below') || lower.includes('cheaper') || lower.includes('dollars'))) {
    const parsed = parseFloat(priceMatch[1]);
    if (!isNaN(parsed) && parsed > 0 && parsed < 500) {
      maxPrice = parsed;
    }
  }

  // Detect Author
  let detectedAuthor: string | undefined = undefined;
  if (lower.includes('johnny') || lower.includes('blue')) {
    detectedAuthor = 'Johnny Blue';
  }

  // Filter books matching these extracted dimensions
  let matchedBooks = catalog.filter(book => {
    let matches = true;

    if (detectedAuthor && !book.author.toLowerCase().includes('johnny')) {
      matches = false;
    }

    if (detectedFormat) {
      const hasFormat = Object.values(book.formats || {}).some(f => f.type === detectedFormat);
      if (!hasFormat) matches = false;
    }

    if (maxPrice && detectedFormat) {
      const formatObj = Object.values(book.formats || {}).find(f => f.type === detectedFormat);
      if (formatObj && formatObj.price > maxPrice) {
        matches = false;
      }
    } else if (maxPrice) {
      const minPrice = Math.min(...Object.values(book.formats || {}).map(f => f.price));
      if (minPrice > maxPrice) {
        matches = false;
      }
    }

    return matches;
  });

  // If keyword matches specific book titles or descriptions
  if (matchedBooks.length === 0) {
    const searchTerms = lower.split(' ').filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'show', 'find', 'give', 'books', 'book'].includes(w));
    matchedBooks = catalog.filter(book => {
      const text = `${book.title} ${book.author} ${book.description} ${book.category}`.toLowerCase();
      return searchTerms.some(term => text.includes(term));
    });
  }

  // Fallback to top rated if no direct match
  if (matchedBooks.length === 0) {
    matchedBooks = catalog.slice(0, 3);
  }

  // Determine intent
  let recognizedIntent: AiVoiceSearchResult['recognizedIntent'] = 'general';
  if (detectedFormat && maxPrice) recognizedIntent = 'price_filter';
  else if (detectedFormat) recognizedIntent = 'filter_format';
  else if (detectedDimensionNumber) recognizedIntent = 'dimension_inquiry';
  else if (detectedAuthor) recognizedIntent = 'author_query';
  else recognizedIntent = 'search_topic';

  // Compose natural conversational spoken voice summary
  let voiceSummary = `Found ${matchedBooks.length} masterwork${matchedBooks.length > 1 ? 's' : ''}`;
  if (detectedFormat) {
    const formatLabels: Record<string, string> = {
      silk_cotton: 'in handcrafted Silk & Cotton weave',
      manuscript: 'featuring raw handwritten notebook scans',
      audiobook: 'in narrated Audiobook dimension',
      videobook: 'in 4K cinematic video dimension',
      hardcover: 'in clothbound hardcover edition',
      papercover: 'in trade paperback print',
      pendrive_sd: 'in USB & Micro-SD archive vault',
      musical_album: 'with original motion soundtracks',
      digital_device: 'preloaded onto dedicated E-Ink hardware',
      ebook: 'in reflowable eBook format'
    };
    voiceSummary += ` ${formatLabels[detectedFormat] || detectedFormat}`;
  }
  if (maxPrice) {
    voiceSummary += ` under $${maxPrice}`;
  }
  voiceSummary += ` on Knowledge Centa.`;

  return {
    recognizedIntent,
    cleanSearchQuery: transcript,
    detectedFormat,
    detectedDimensionNumber,
    maxPrice,
    detectedAuthor,
    voiceAnswerSummary: voiceSummary,
    matchingBookIds: matchedBooks.map(b => b.id),
    suggestedFollowUps: [
      `Show all 10 dimensions of ${matchedBooks[0]?.title || 'The Sovereign Architect'}`,
      `Listen to audio sample`,
      `Read handwritten scans`
    ],
    confidenceScore: detectedFormat || maxPrice || detectedAuthor ? 0.94 : 0.78
  };
}

function filterCatalogByAiParams(catalog: Book[], params: any): Book[] {
  return catalog.filter(book => {
    if (params.detectedFormat) {
      const hasFmt = Object.values(book.formats || {}).some(f => f.type === params.detectedFormat);
      if (!hasFmt) return false;
    }
    if (params.maxPrice && params.detectedFormat) {
      const fmt = Object.values(book.formats || {}).find(f => f.type === params.detectedFormat);
      if (fmt && fmt.price > params.maxPrice) return false;
    }
    if (params.detectedAuthor && !book.author.toLowerCase().includes(params.detectedAuthor.toLowerCase())) {
      return false;
    }
    if (params.detectedCategory && !book.category.toLowerCase().includes(params.detectedCategory.toLowerCase())) {
      return false;
    }
    return true;
  });
}
