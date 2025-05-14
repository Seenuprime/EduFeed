import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Content, Topic } from '@/types/content';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL = 'gemma2:2b';

const ALL_TOPICS: Topic[] = ['motivation', 'history', 'science', 'space', 'technology', 'nature', 'health', 'computer_science'];

function getRandomTopic() {
  return ALL_TOPICS[Math.floor(Math.random() * ALL_TOPICS.length)];
}

async function generateFact(topic: Topic, factNumber: number): Promise<Content> {
  const prompt = `Generate an interesting educational fact about ${topic}. This is fact number ${factNumber}. The fact should be 5-8 sentences long and be engaging and informative. Return only the fact content, without any headings, numbers, or prefixes. Do not include 'Fact Number', 'Fact', or any Markdown headings. Just the fact itself.`;
  
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    let content = data.response.trim();
    content = content.replace(/^#+\s*.*?(Fact\s*Number\s*\d+:?|Fact\s*\d+:?)?/i, '').replace(/^\d+:\s*/, '').trim();

    return {
      _id: uuidv4(),
      title: `Interesting Fact About ${topic.charAt(0).toUpperCase() + topic.slice(1)} #${factNumber}`,
      content,
      topic,
      author: 'AI Educator',
      likes: Math.floor(Math.random() * 1000),
      saves: Math.floor(Math.random() * 100),
    };
  } catch (error) {
    console.error('Error generating fact:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let topic = searchParams.get('topic') as Topic;
  const page = parseInt(searchParams.get('page') || '1');

  if (!topic || !['motivation', 'history', 'science', 'space', 'for_you', 'technology', 'nature', 'health', 'computer_science'].includes(topic)) {
    return NextResponse.json(
      { error: 'Invalid topic. Must be one of: motivation, history, science, space, for_you, technology, nature, health, computer_science' },
      { status: 400 }
    );
  }

  try {
    const startFactNumber = (page - 1) * 5 + 1;
    let facts;
    if (topic === 'for_you') {
      facts = await Promise.all(
        Array.from({ length: 5 }, (_, i) => {
          const randomTopic = getRandomTopic();
          return generateFact(randomTopic, startFactNumber + i);
        })
      );
    } else {
      facts = await Promise.all(
        Array.from({ length: 5 }, (_, i) => 
          generateFact(topic, startFactNumber + i)
        )
      );
    }

    return NextResponse.json(facts);
  } catch (error) {
    console.error('Error in feed API:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 