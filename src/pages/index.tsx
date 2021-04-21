import { useEffect } from "react"


export default function Home(props) {
  
  function print(){
    for (let i=0;i<10;i++){
        console.log(props.data.length)
    }
  }

  useEffect(()=>{print()},[])
  
  return (
    <>
    
    </>
    )
}

export async function getStaticProps(){
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
  
  return{
    props:{
      data: data,
    },
   revalidate: 5
  }
  
}