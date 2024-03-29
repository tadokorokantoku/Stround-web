import { ChangeEvent, FC, useState } from 'react';
import Modal from '../../components/Modal';

import { searchSongs } from '@/actions/searchSongs';
import Input from '@/components/Input';
import SearchItem from '@/domain/SearchModal/SearchItem';
import useSearchModal from '@/hooks/useSearchModal';
import { useUser } from '@/hooks/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import toast from 'react-hot-toast';

type artist = {
  name: string;
  id: string;
  type: string;
  uri: string;
};

type album = {
  artists: artist[];
  name: string;
  id: string;
  type: string;
  uri: string;
  images: image[];
  release_date: string;
  total_tracks: number;
};

type image = {
  height: number;
  url: string;
  width: number;
};

interface fetchedSong {
  id: number;
  name: string;
  artists: artist[];
  album: album;
  year: number;
  genre: string;
  duration: number;
  preview_url: string;
  file: string;
}

const SearchModal: FC = () => {
  const searchModal = useSearchModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<fetchedSong[]>([]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuery(value);

    const query = value;
    searchSongs(query)
      .then(songs => {
        setSongs(songs);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onClose = () => {
    searchModal.onClose();
    setQuery('');
    setSongs([]);
  };

  const addSong = async (data: fetchedSong) => {
    if (!user) {
      return;
    }

    const { error: supabaseError } = await supabaseClient.from('songs').insert({
      user_id: user.id,
      title: data.name,
      author: data.artists[0].name,
      image_path: data.album.images[1].url,
      song_path: data.preview_url,
      update_at: new Date(),
    });

    if (supabaseError) {
      setIsLoading(false);
      return toast.error(supabaseError.message);
    }
  };

  const deleteSong = async () => {
    if (searchModal.exchangeTargetId === null) {
      return;
    }

    const { error: supabaseError } = await supabaseClient
      .from('songs')
      .update({
        is_deleted: true,
        deleted_date: new Date(),
        update_at: new Date(),
      })
      .eq('id', searchModal.exchangeTargetId);

    if (supabaseError) {
      setIsLoading(false);
      return toast.error(supabaseError.message);
    }
  };

  const onClickItem = async (data: fetchedSong) => {
    try {
      setIsLoading(true);
      if (searchModal.isExchanging) {
        await deleteSong();
      }

      await addSong(data);
      setIsLoading(false);
      toast.success(
        searchModal.isExchanging ? '曲を入れ替えました!' : '曲を追加しました!',
      );
    } catch (e) {
      console.log(e);
      toast.error('Something went wrong!');
    }
  };

  if (!searchModal.isOpen) {
    return null;
  }

  return (
    <Modal
      title={searchModal.isExchanging ? '曲の入れ替え' : '曲の追加'}
      description=''
      isOpen={searchModal.isOpen}
      onChange={() => {}}
      onClose={onClose}
    >
      <div>
        <div className='pb-1'>曲名</div>
        <Input
          id='query'
          type='text'
          value={query}
          disabled={isLoading}
          onChange={onChange}
          placeholder='「曲名 アーティスト名」と入力するとBetter！'
        />
      </div>
      <div className='h-80 overflow-y-auto mt-5'>
        {songs.length !== 0 && query.length !== 0 ? (
          songs.map(song => (
            <div key={song.id} className='mb-5 mt-5'>
              <SearchItem
                image={song.album.images[1]?.url}
                name={song.name}
                author={song.artists[0].name}
                onClick={() => onClickItem(song)}
              />
            </div>
          ))
        ) : (
          <div className='text-neutral-400 h-40'>
            該当する曲が見つかりません。
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
