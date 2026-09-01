'use client';

import { Story } from '@prisma/client';
import { useState } from 'react';
import ReactInstaStories from 'react-insta-stories';

interface Props {
  stories: (Story & { items: any[] })[];
}

export const Stories = ({ stories }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);

  if (!stories.length) return null;

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      {stories.map((story) => (
        <div
          key={story.id}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => {
            setSelectedStory(story);
            setOpen(true);
          }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-xs">{story.title?.[0]}</span>
            </div>
          </div>
          <span className="text-xs mt-1">{story.title}</span>
        </div>
      ))}
      {open && selectedStory && (
        <ReactInstaStories
          stories={selectedStory.items.map((item: any) => ({
            url: item.mediaUrl,
            header: { heading: selectedStory.title, subheading: '' },
            seeMore: item.description ? { text: 'Подробнее', action: () => {} } : undefined,
          }))}
          defaultInterval={4000}
          onAllStoriesEnd={() => setOpen(false)}
          onStoryEnd={() => {}}
        />
      )}
    </div>
  );
};
