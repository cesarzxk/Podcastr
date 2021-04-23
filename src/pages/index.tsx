import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import {GetStaticProps} from 'next';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss'; 
import Image from 'next/image';
import Link from 'next/link';


type Episode ={
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAT: string;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
}

export default function Home({allEpisodes, latestEpisodes}:HomeProps) {
  
  return (
    
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2> ultimos lançamentos </h2>
          <ul>
          {latestEpisodes.map(episode => {
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

                      <button type='button'>
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
            allEpisodes.map(episode => {
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
                      <button type='button'>
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