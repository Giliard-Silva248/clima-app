import { useRef, useState } from 'react';
import style from './style.module.scss';
import { FaSearch } from "react-icons/fa";
import axios from 'axios';

interface Clima {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
};

export function InfoClima() {
  const [clima, setClima] = useState<Clima | null>(null);
  const [pesquisa, setPesquisar] = useState('');

  const refMsg = useRef<HTMLParagraphElement>(null);

  async function searchData() {
    if (pesquisa.trim() === '') {
      if (refMsg.current) {
        refMsg.current.innerHTML = 'Por favor, digite o nome de uma cidade.';
      }
      setClima(null);
      return;
    }

    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${pesquisa}&appid=9dae57172eb398c12252ac24fc4d0eb2&lang=pt_br&units=metric`);
      setClima(response.data);
      if (refMsg.current) {
        refMsg.current.innerHTML = '';
      }
    } catch (error) {
      if (refMsg.current) {
        refMsg.current.innerHTML = 'O nome da cidade está errado ou não existe!';
      }
      setClima(null);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPesquisar(e.target.value);
    if (e.target.value.trim() !== '' && refMsg.current) {
      refMsg.current.innerHTML = '';
    }
  }

  function getBackgroundClass() {
    if (!clima) return style.vazio;
    const main = clima.weather[0].main.toLowerCase();
    if (['thunderstorm', 'drizzle', 'rain', 'clouds'].includes(main)) {
      return style.grupoA;
    } else if (['snow', 'mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash'].includes(main)) {
      return style.grupoB;
    } else if (['squall', 'tornado'].includes(main)) {
      return style.grupoC;
    } else if (['clear'].includes(main)) {
      return style.grupoD;
    }
    return style.vazio;
  }

  return (
    <section className={getBackgroundClass()}>
      <div className={style.sec}>
        <div className={style.container}>
          <div className={style.search}>
            <input 
              type="text" 
              value={pesquisa} 
              onChange={handleInputChange} 
              placeholder="Digite o nome da cidade" 
              className={style.input}
            />
            <button onClick={searchData} className={style.btn}>Pesquisar <FaSearch /></button>
          </div>
          <p id='msg-erro' ref={refMsg}></p>
          {clima && (
            <div className={style.infoClima}>
              <h3>{clima.name}</h3>
              <p>{new Date().toLocaleDateString()}</p>
              <p>Temperatura: {clima.main.temp}°C</p>
              <p>Clima: {clima.weather[0].description}</p>
              <img 
                src={`http://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`} 
                alt={clima.weather[0].description} 
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
