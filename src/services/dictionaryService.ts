/**
 * Dictionary Service for Johnnyblue1 Books Stores & Knowledge Centa
 * Provides instant definitions, phonetics, audio pronunciations, and synonyms
 * with built-in vocabulary and public API fallback.
 */

export interface WordMeaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
    synonyms?: string[];
  }[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  meanings: WordMeaning[];
  source: 'built-in' | 'api' | 'smart-fallback';
}

// Comprehensive offline dictionary database of key literary, philosophical, cognitive, and publishing terms
const BUILT_IN_DICTIONARY: Record<string, DictionaryEntry> = {
  sovereign: {
    word: 'sovereign',
    phonetic: '/ˈsɒvrɪn/',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Possessing supreme or ultimate power; acting independently without outside control.',
            example: 'A sovereign reader cultivates cognitive independence from algorithmic feeds.',
            synonyms: ['independent', 'autonomous', 'supreme', 'self-governing']
          },
          {
            definition: 'Of the highest quality, degree, or efficacy.',
            example: 'A sovereign remedy for digital distraction.'
          }
        ]
      },
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A supreme ruler, especially a monarch, or a person possessing total intellectual autonomy.'
          }
        ]
      }
    ],
    source: 'built-in'
  },
  cadence: {
    word: 'cadence',
    phonetic: '/ˈkeɪdns/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A rhythmic flow of a sequence of sounds or words; the beat, rate, or measure of rhythmic motion.',
            example: 'The acoustic cadence of the author’s spoken prose guided the reader into calm focus.',
            synonyms: ['rhythm', 'tempo', 'meter', 'inflection']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  genesis: {
    word: 'genesis',
    phonetic: '/ˈdʒenəsɪs/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The origin or mode of formation of something; the beginning or creation.',
            example: 'The chapter documents the genesis of the intentional publishing architecture.',
            synonyms: ['origin', 'birth', 'inception', 'emergence']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  dimension: {
    word: 'dimension',
    phonetic: '/daɪˈmenʃn/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'An aspect or feature of a situation, problem, or artistic creation.',
            example: 'This book extends across ten distinct physical, digital, and sensory dimensions.',
            synonyms: ['aspect', 'facet', 'element', 'measure']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  cognitive: {
    word: 'cognitive',
    phonetic: '/ˈkɒɡnətɪv/',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Relating to mental processes of perception, memory, judgment, and reasoning.',
            example: 'Deep reading engages multiple interconnected cognitive pathways.',
            synonyms: ['intellectual', 'cerebral', 'mental', 'rational']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  timbre: {
    word: 'timbre',
    phonetic: '/ˈtæmbər/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The character or quality of a musical sound or voice as distinct from its pitch and intensity.',
            example: 'The warm acoustic timbre of vacuum-tube microphones.',
            synonyms: ['tone', 'resonance', 'sound quality', 'color']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  resonance: {
    word: 'resonance',
    phonetic: '/ˈrezənəns/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The quality in a sound of being deep, full, and reverberating; also the evocative quality of shared meaning.',
            example: 'The words achieved emotional resonance across generations of readers.',
            synonyms: ['reverberation', 'depth', 'evocativeness', 'vibrancy']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  paradigm: {
    word: 'paradigm',
    phonetic: '/ˈpærədaɪm/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A typical example, pattern, or overarching conceptual model of something.',
            example: 'A new paradigm for author independence and direct-to-reader distribution.',
            synonyms: ['model', 'archetype', 'framework', 'prototype']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  immersion: {
    word: 'immersion',
    phonetic: '/ɪˈmɜːʃn/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'Deep mental involvement in an activity, subject, or reading experience.',
            example: 'Entering a state of deep literary immersion without phone notifications.',
            synonyms: ['absorption', 'engagement', 'concentration', 'engrossment']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  integrity: {
    word: 'integrity',
    phonetic: '/ɪnˈteɡrəti/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The quality of being honest and having strong moral principles; or the state of being whole and undivided.',
            example: 'Preserving the artistic and typographic integrity of the printed text.',
            synonyms: ['wholeness', 'honesty', 'purity', 'soundness']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  manuscript: {
    word: 'manuscript',
    phonetic: '/ˈmænjuskrɪpt/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A book, document, or piece of music written by hand rather than typed or printed.',
            example: 'The edition preserves raw handwritten manuscript scans drafted with fountain pens.',
            synonyms: ['text', 'draft', 'autograph', 'script']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  epilogue: {
    word: 'epilogue',
    phonetic: '/ˈepɪlɒɡ/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A section or speech at the end of a book or play that serves as a comment on or conclusion to what has happened.',
            example: 'The epilogue reflects on the philosophical stakes of publishing in the modern era.',
            synonyms: ['afterword', 'postscript', 'conclusion', 'coda']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  archival: {
    word: 'archival',
    phonetic: '/ɑːˈkaɪvl/',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Of or relating to archives; durable and acid-free material suitable for long-term preservation.',
            example: 'Archival paper ensures ink formulation remains vibrant for fifty years.',
            synonyms: ['permanent', 'preserved', 'documentary', 'historical']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  codex: {
    word: 'codex',
    phonetic: '/ˈkəʊdeks/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'An ancient or bound manuscript in book form, rather than a scroll.',
            example: 'The clothbound hardcover codex represents centuries of physical bookbinding craft.',
            synonyms: ['volume', 'manuscript', 'tome', 'bound book']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  monosensory: {
    word: 'monosensory',
    phonetic: '/ˌmɒnəʊˈsensəri/',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Engaging or stimulating only a single physical sense (as opposed to multi-sensory).',
            example: 'Digital reading on monochrome screens often becomes a mono-sensory experience.',
            synonyms: ['single-sense', 'unimodal']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  bionic: {
    word: 'bionic',
    phonetic: '/baɪˈɒnɪk/',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Utilizing artificial focal points to enhance biological reading comprehension and speed.',
            example: 'Bionic reading highlights the opening characters of each word to guide saccadic eye movements.',
            synonyms: ['augmented', 'enhanced', 'assisted']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  synthesis: {
    word: 'synthesis',
    phonetic: '/ˈsɪnθəsɪs/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The combination of ideas to form a theory or system; the complex whole formed by combining elements.',
            example: 'A harmonious synthesis of traditional letterpress printing and AI-grounded knowledge curation.',
            synonyms: ['combination', 'integration', 'fusion', 'amalgam']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  lucid: {
    word: 'lucid',
    phonetic: '/ˈluːsɪd/',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Expressed clearly; easy to understand; bright or luminous; characterized by clear perception.',
            example: 'The author presented a lucid philosophical analysis of modern reading habits.',
            synonyms: ['clear', 'coherent', 'articulate', 'luminous']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  empathy: {
    word: 'empathy',
    phonetic: '/ˈempəθi/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The ability to understand and share the feelings of another.',
            example: 'Literary fiction deepens neurological empathy by allowing readers to inhabit other lives.',
            synonyms: ['compassion', 'sensitivity', 'understanding', 'affinity']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  curation: {
    word: 'curation',
    phonetic: '/kjʊəˈreɪʃn/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The action or process of selecting, organizing, and looking after items in a collection or literary catalog.',
            example: 'Knowledge Centa prioritizes sovereign author curation over automated algorithmic noise.',
            synonyms: ['selection', 'organization', 'stewardship']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  solitude: {
    word: 'solitude',
    phonetic: '/ˈsɒlɪtjuːd/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The state or situation of being alone, especially when peaceful and pleasant.',
            example: 'Deep reading requires a sacred oasis of quiet solitude.',
            synonyms: ['seclusion', 'peace', 'privacy', 'tranquility']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  meticulous: {
    word: 'meticulous',
    phonetic: '/məˈtɪkjələs/',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Showing great attention to detail; very careful and precise.',
            example: 'The author applied meticulous attention to typography, margins, and paper weights.',
            synonyms: ['diligent', 'scrupulous', 'painstaking', 'thorough']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  dossier: {
    word: 'dossier',
    phonetic: '/ˈdɒsieɪ/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A collection of detailed documents about a particular person, event, subject, or book.',
            example: 'The print-friendly book dossier compiles comprehensive specifications for collectors.',
            synonyms: ['file', 'report', 'record', 'archive']
          }
        ]
      }
    ],
    source: 'built-in'
  },
  hypervigilance: {
    word: 'hypervigilance',
    phonetic: '/ˌhaɪpəˈvɪdʒɪləns/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'An enhanced state of sensory sensitivity accompanied by an exaggerated intensity of behaviors to detect threats or notifications.',
            example: 'Sustained reading calms the digital hypervigilance induced by continuous phone notifications.'
          }
        ]
      }
    ],
    source: 'built-in'
  },
  neurobiological: {
    word: 'neurobiological',
    phonetic: '/ˌnjʊərəʊˌbaɪəˈlɒdʒɪkl/',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Relating to the anatomy, physiology, and pathology of the nervous system and brain.',
            example: 'Deep reading stimulates neurobiological circuits responsible for complex empathy.'
          }
        ]
      }
    ],
    source: 'built-in'
  }
};

// In-memory runtime cache so lookups are lightning fast and cached across session
const entryCache = new Map<string, DictionaryEntry>();

// Populate cache with built-in dictionary
Object.entries(BUILT_IN_DICTIONARY).forEach(([k, v]) => {
  entryCache.set(k.toLowerCase(), v);
});

/**
 * Fetch or compute dictionary definition for a given word.
 */
export async function lookupWordDefinition(rawWord: string): Promise<DictionaryEntry> {
  const cleanWord = rawWord
    .trim()
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z]+$/g, '');

  if (!cleanWord) {
    throw new Error('Please select a valid word to define.');
  }

  // Check cache first
  if (entryCache.has(cleanWord)) {
    return entryCache.get(cleanWord)!;
  }

  // Attempt lookup from public Free Dictionary API (CORS enabled)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2600);

    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        
        // Find phonetic and audio
        let phonetic = item.phonetic;
        let audioUrl = '';
        if (Array.isArray(item.phonetics)) {
          for (const ph of item.phonetics) {
            if (!phonetic && ph.text) phonetic = ph.text;
            if (!audioUrl && ph.audio) audioUrl = ph.audio;
          }
        }

        const meanings: WordMeaning[] = (item.meanings || []).slice(0, 3).map((m: any) => ({
          partOfSpeech: m.partOfSpeech || 'word',
          definitions: (m.definitions || []).slice(0, 2).map((d: any) => ({
            definition: d.definition,
            example: d.example,
            synonyms: (d.synonyms || []).slice(0, 4)
          }))
        }));

        const entry: DictionaryEntry = {
          word: cleanWord,
          phonetic,
          audioUrl,
          meanings,
          source: 'api'
        };

        entryCache.set(cleanWord, entry);
        return entry;
      }
    }
  } catch {
    // Fall back gracefully
  }

  // Smart morphological fallback for derived words (e.g. plurals, past tenses, adverbs, gerunds)
  const fallback = generateSmartFallback(cleanWord);
  entryCache.set(cleanWord, fallback);
  return fallback;
}

/**
 * Generate intelligent morphological analysis and dictionary definition
 * for words not found in immediate API or built-in databases.
 */
function generateSmartFallback(word: string): DictionaryEntry {
  let partOfSpeech = 'word';
  let definition = `Literary and contextual term: "${word}".`;
  let example = `Examined in the context of the manuscript's thesis.`;

  if (word.endsWith('ly')) {
    partOfSpeech = 'adverb';
    const root = word.slice(0, -2);
    definition = `In a manner characteristic of being ${root}; expressing method, degree, or circumstance.`;
    example = `The prose flowed ${word} across the parchment.`;
  } else if (word.endsWith('tion') || word.endsWith('sion') || word.endsWith('ment') || word.endsWith('ness')) {
    partOfSpeech = 'noun';
    definition = `The state, quality, condition, or process of ${word.replace(/(tion|sion|ment|ness)$/, '')}.`;
    example = `An essential attribute contributing to literary coherence and focus.`;
  } else if (word.endsWith('ing')) {
    partOfSpeech = 'verb (present participle) / noun';
    definition = `The continuous action, process, or practice of the root activity.`;
    example = `Engaged in ${word} with intentional authorial discipline.`;
  } else if (word.endsWith('ed')) {
    partOfSpeech = 'verb (past tense / participle)';
    definition = `Having completed or undergone the action described by the root verb.`;
    example = `The formulation was carefully ${word} during the drafting process.`;
  } else if (word.endsWith('ic') || word.endsWith('al') || word.endsWith('ous') || word.endsWith('ive') || word.endsWith('ful')) {
    partOfSpeech = 'adjective';
    definition = `Characterized by, exhibiting, or endowed with the qualities of the designated concept.`;
    example = `A distinctly ${word} expression within sovereign literature.`;
  } else if (word.endsWith('s') && !word.endsWith('ss')) {
    partOfSpeech = 'noun (plural)';
    definition = `Plural form or collective designation of multiple instances.`;
    example = `Observed among the varied ${word} of the work.`;
  }

  return {
    word,
    phonetic: `/${word}/`,
    meanings: [
      {
        partOfSpeech,
        definitions: [
          {
            definition,
            example
          }
        ]
      }
    ],
    source: 'smart-fallback'
  };
}

/**
 * Pronounce word using browser speech synthesis
 */
export function speakWord(word: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}
