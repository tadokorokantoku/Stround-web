import ListItem from '@/components/ListItem';
import useSearchModal from '@/hooks/useSearchModal';
import { Song } from '@/types';
import { FC } from 'react';

interface Best10SongsProps {
  songs: Song[];
  forMe: boolean;
}

const Best10Songs: FC<Best10SongsProps> = ({ songs, forMe }) => {
  const searchModal = useSearchModal();

  return (
    <div>
      <div
        className='
        grid
        grid-cols-2
        mt-4
        gap-y-4
      '
      >
        {songs.length !== 0 ? (
          songs.map(item => (
            <ListItem
              key={item.id}
              songId={item.id}
              onClick={forMe ? () => searchModal.onExchange(item.id) : () => {}}
              title={item.title}
              author={item.author}
              imagePath={item.image_path}
              audioUrl={item.song_path}
            />
          ))
        ) : (
          <div className='text-neutral-400 h-40'>No songs available.</div>
        )}
      </div>
    </div>
  );
};

export default Best10Songs;
