import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { api } from "@/lib/axios";
import { CompletedSessions, SessionsResponse } from "@/models/interfaces/Sessions";
import { GetStaticProps } from "next";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

interface HomeProps {
  sessions: CompletedSessions[];
}

export default function Home({ sessions }: HomeProps) {
  const [pageSessions, setPageSessions] = useState<CompletedSessions[]>([])

  async function handleFilterSessions(dateToFilter: Date) {
    
   const {data} = await api.post<SessionsResponse>("/session/getSessionsByDate", {
      date: dateToFilter.toISOString()
    })
    
    setPageSessions(data.sessions)
  }

  useEffect(()=>{

    setPageSessions(sessions)

  }, [sessions])

  const formatCurrentDay = new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    day: "2-digit",
    month: "2-digit"
    
  })

  

  return (
    <main className="flex flex-col justify-center pb-10 items-center">
      <Header />
      <div className="relative w-full h-full" >
      <Image width={10000} height={10000} src={"/Images/Background.jpg"} alt="" />
      <span className="absolute opacity-70 w-full h-full z-10 bg-black top-0 flex justify-center items-center " >
        <h1 className="text-orange-500 text-5xl font-extrabold" >CINEMA</h1>
      </span>
      </div>
      <div className="bg-[#5191C1] px-5 my-5 flex gap-4 rounded-3xl ">
        <h1 className="my-4">Programação do dia:</h1>
        <input
          className="bg-[#0A4B75] text-white py-4 px-2 w-32"
          type="date"
          name="day"
          // value={"31/05/2023"}
          defaultValue={formatCurrentDay.format(new Date())}
          id="day"
          onChange={(event: ChangeEvent<HTMLInputElement>)=>{
            
            handleFilterSessions(new Date(event.target.value))
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-5">
        {pageSessions.map(({ movie, room, session }) => (
          <MovieCard key={session.id + movie.id + room.id} movie={movie} room={room} session={session}></MovieCard>
        ))}
      </div>
    </main>
  );
}

interface StaticPropsReturn {
  sessions: CompletedSessions[];
}

export const getStaticProps: GetStaticProps<StaticPropsReturn> = async () => {

  const {data} = await api.post<SessionsResponse>("/session/getSessionsByDate", {
    date: new Date()
  })

  return {
    props: {
      sessions: data.sessions,
    },
  };
};
