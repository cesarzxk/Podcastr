import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import {GetStaticProps} from 'next';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss'; 
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../contexts/playerContext';
import Head from 'next/head';


type Episode ={
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAT: string;
  durationAsString: string;
  duration:number;
  url: string;
}

type HomeProps = {
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
}

export default function Home({allEpisodes, latestEpisodes}:HomeProps) {
  const {playList} = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];
  
  return (
    
    <div className={styles.homepage}>

      <Head> <title> Home | Podcastr</title> </Head>

      <section className={styles.latestEpisodes}>
        <h2> ultimos lançamentos </h2>
          <ul>
          {latestEpisodes.map((episode, index) => {
                  return(
                    <li key={episode.id}>
                      <div className={styles.image}>
                        <Image
                        width={192} 
                        height={192} 
                        objectFit="cover" 
                        src={episode.thumbnail} 
                        alt={episode.title}/>
                      </div>
                      
                      <div className={styles.episodeDetails}>
                          <Link href={`/episodes/${episode.id}`}>
                            <a>{episode.title}</a>
                          </Link>
                          <p>{episode.members}</p>
                          <span>{episode.publishedAT}</span>
                          <span>{episode.durationAsString}</span>
                      </div>

                      <button type='button' onClick={()=>playList(episodeList, index)}>
                          <img src="/play-green.svg" alt="Tocar episódio."/>
                      </button>
                    </li>
                  )
                }
              )
            }
          </ul>
        
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos Episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
            </tr>
          </thead>
          <tbody>

            {
            allEpisodes.map((episode, index) => {
              return(
                <tr key={episode.id}>
                  <td style={{width:75}}>
                    <Image className={styles.imagem}
                        width={120} 
                        height={120} 
                        objectFit="cover" 
                        src={episode.thumbnail} 
                        alt={episode.title}/>
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                      
                    </td>
                    <td>{episode.members}</td>
                    <td style={{width:100}}>{episode.publishedAT}</td>
                    <td>{episode.durationAsString}</td>  
                    <td>
                      <button type='button' onClick={()=>playList(episodeList, index + latestEpisodes.length )}>
                          <img src="/play-green.svg" alt="Tocar episódio."/>
                      </button>
                    </td>
                
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      
    </div>
    )
}

export const getStaticProps:GetStaticProps = async () => {

  const {data} = await api.get('episodes',{
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    },
  });


  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail : episode.thumbnail,
      members: episode.members,
      publishedAT: format(parseISO(episode.published_at), 'd MMM yy', {locale:ptBR}),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      duration:Number(episode.file.duration),
      description: episode.description,
      url: episode.file.url,
    }
  });
  
  const latestsEpisodes = episodes.slice(0,2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return{
    props:{
      allEpisodes: allEpisodes,
      latestEpisodes:latestsEpisodes,
    }
  }

}