import Map from '@/components/Map'
import SearchBar from '@/components/SearchBar';



export default function Home() {
  return (
    <div className='relative'>
      <div className='absolute top-[20px] left-1/2 transform -translate-x-1/2 z-10'>
        <SearchBar />
      </div>
      <Map/>
    </div>
  );
}