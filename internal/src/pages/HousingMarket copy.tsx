import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import LegendTable from '../components/chartjs/LegendTable';
import '../components/housingmarket/housingmarket.scss';

interface EstateRow {
  ba0: string;
  ba1: string;
  ba2: string;
  ba3: string;
  ba4: string;
  ba5: string;
  ba6: string;
  ba7: string;
  beboelses_enheder: string;
  beboet_af_ejer: string;
  bs1: string;
  bs2: string;
  bs3: string;
  bs4: string;
  bs5: string;
  bs6: string;
  bt1: string;
  bt2: string;
  bt3: string;
  bt4: string;
  bt5: string;
  dato: string;
  ef1: string;
  ef2: string;
  ef3: string;
  ef4: string;
  ef5: string;
  ef6: string;
  flexbolig: string;
  husstand_0: string;
  husstand_1: string;
  husstand_2: string;
  husstand_3: string;
  husstand_4: string;
  husstand_5: string;
  ib1: string;
  ib2: string;
  ib3: string;
  kondemnret: string;
  nedrevne: string;
  omraade: string;
  summerhus_bs1: string;
  summerhus_bs2: string;
  summerhus_bs3: string;
  summerhus_bs4: string;
  summerhus_bs5: string;
  summerhus_bs6: string;
  summerhus_husstand_0: string;
  summerhus_husstand_1: string;
  summerhus_husstand_2: string;
  summerhus_husstand_3: string;
  summerhus_husstand_4: string;
  summerhus_husstand_5: string;
  summerhus_kondemnret: string;
  thuf: string;
}
const getDates = (data: EstateRow[]) => {
  const uniqueDates = [...new Set(data.map((item) => item.dato))];
  uniqueDates.sort(
    (a, b) => a.localeCompare(b) //using String.prototype.localCompare() abc...
  );
  return uniqueDates;
};

const HousingMarketPage: FC = () => {
  const minimap: any = useRef(null);
  const [estateData, setEstateData] = useState([]);
  const [date, setDate] = useState<string>('2022-02-15 00:00:00.0');
  const onMapReady = (mm) => {
    minimap.current = mm;
    const ses = mm.getSession();
    const ds = ses.getDatasource('lk_talomlolland_boligmarked');
    ds.execute({ command: 'read' }, function (rows: EstateRow[]) {
      setEstateData(rows);
    });
  };
  console.log('estateData: ', estateData);
  console.log('date: ', date);
  const dates = getDates(estateData)
  //Label til timeseries
  const labels:string[] = [];
  const month:string[] = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];
  for (let i=0;i<dates.length;i++){
    const d = new Date(dates[i]);
    const m = month[d.getMonth()];
    const y = d.getFullYear();
    const label = m+' '+y;
    labels.push(label);
  }
  console.log('labels: ', labels);

  interface BtData{ //createPiechart
    categories: string[]; // ['Stuehus til landbrugsejendom', 'Parcelhus', 'Tæt-lav boligbebyggelse', 'Bolig i etageejendom', 'Andet']
    label: string; // 'Nakskov'
    data: number[]; //[12, 3379, 1652, 2368, 96] -- [b1i, bt2, bt3, bt4, bt5]
  }
  interface BtData{ //createStackedbar
    series: string[]; // ['Stuehus til landbrugsejendom', 'Parcelhus', 'Tæt-lav boligbebyggelse', 'Bolig i etageejendom', 'Andet']
    dates: string[]; // ['2022-07-15 00:00:00.0', '2022-06-15 00:00:00.0', '2022-05-15 00:00:00.0', '2022-04-15 00:00:00.0', '2022-03-15 00:00:00.0', '2022-02-15 00:00:00.0']
    categories: string[]; // [ Jul 2022', 'Jun 2022', 'Maj 2022', 'Apr 2022', 'Mar 2022', 'Feb 2022'] 
    title: string; // 'Nakskov'
    seriesData: number[][]; //[[12, 12, 12, 12, 12, 12],[3379, 3379, 3380, 3380, 3380, 3380], [1652, 1652, 1652, 1652, 1652, 1652],[2368, 2361, 2361, 2361, 2361, 2361],][96, 97, 97, 97, 97, 97]]
  }
  const btCodes: string[] = ['bt1','bt2','bt3','bt4','bt5'];
  const omraadeCodes: string[] = ['nakskov', 'maribo', 'roedby', 'landomraader'];
  const omraader: string[] = ['Nakskov', 'Maribo', 'Rødby', 'Øvrigt'];
  const boligtyper: string[] = ['Stuehus til landbrugsejendom', 'Parcelhus', 'Tæt-lav boligbebyggelse', 'Bolig i etageejendom', 'Andet'];
  const antalBoligere: number[][][] = []
  for (let i = 0;i < omraadeCodes.length; i++){
    const omraadeCode = omraadeCodes[i];
    const omraadeData = estateData.filter(row=>row.omraade === omraadeCode).sort((r1,r2)=> {
      const d1 = new Date(r1.dato)
      const d2 = new Date(r2.dato)
      return d1.getTime()-d2.getTime()
    })
    const boligtypeCounts: number[][] = [[],[],[],[],[]];
    omraadeData.forEach(element => {
      for (let j=0;j<btCodes.length;j++){
        const btCode = btCodes[j];
        boligtypeCounts[j].push(parseInt(element[btCode]));
      }
    });
    antalBoligere.push(boligtypeCounts)
  }
  console.log(antalBoligere)
  
  const bTdata: BtData[] = [];
  for (let i = 0; i < dates.length; i++) {
    const datefilter = dates[i];

    // bTdata.push({
    //   categories: ['', ''],
    //   label: '',
    //   data: [estateData.map(item=>item.bt1) , estateData.map(item=>item.bt2)],
    // });
  }
  return (
    <>
      <div id='estate-tab-content' className='container hidden'>
        <div className='columns'>
          <Map
            id='fac52b81-78de-4b6e-bfc7-a34731fc4454'
            name='estate'
            size='is-4'
            onReady={onMapReady}
          />
          <div className='column'>
            <div className='content'>
              <p>
                Alt data i tabeller og lagkagediagrammer er trukket den 15.
                februar 2022.
              </p>
              <p>
                Til søjlediagrammerne tilføjes ny data hver den 15. i måneden.
                Søjlediagrammerne viser således udviklingen for det på gældende
                geografiske område.
              </p>
              <p>Alle optællinger baserer sig på 4 geografiske områder:</p>
              <ul>
                <li>
                  Nakskov som betsår af Sankt Nikolaj Sogn og Stormark Sogn
                </li>
                <li>
                  Maribo som betsår af Maribo Domsogn Sogn og Hunseby Sogn
                </li>
                <li>
                  Rødby som betsår af Rødby Sogn, Sædinge Sogn, Ringsebølle Sogn
                  og Rødbyhavn Sogn
                </li>
                <li>Øvrigt indeholder alle øvrige sogne</li>
              </ul>
              <p></p>
              <p></p>
            </div>
          </div>
        </div>
        <div className='block'>
          <div className='content'>
            <h1>Fakta om boligtyper i Lolland Kommune</h1>
          </div>
          <div className='columns'>
            <div className='column is-two-fifths'>
              <div id='housing-type-table' className='legend'></div>
              <div className='content'>
                {/* <!-- <p id='text-fra-js'></p> --> */}
                <p>
                  Boligtypen er beregnet på baggrund af BBR, udfra enhedens
                  anvendelskode, fra enhedsniveuet. EnhAnvendelseKode større end
                  180 er ikke medtaget i analysen med undtagelse af
                  EnhAnvendelseKode 190 i BBR.
                </p>
                <p>
                  Tæt/lavt bebyggelse udgøres af EnhAnvendelseKode 130, 131 og
                  132 i BBR. Andet udgøres af EnhAnvendelseKode 121, 150, 160 og
                  190 i BBR.
                </p>
              </div>
            </div>
            <div className='column'>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='housing-type-naksov-stackedbar'
                    className='housing-type'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-type-maribo-stackedbar'
                    className='housing-type'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-type-roedby-stackedbar'
                    className='housing-type'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-type-lolland-stackedbar'
                    className='housing-type'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
              </div>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='housing-type-naksov-piechart'
                    className='housing-type'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Nakskov'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-type-maribo-piechart'
                    className='housing-type'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Maribo'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-type-roedby-piechart'
                    className='housing-type'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Rødby'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-type-lolland-piechart'
                    className='housing-type'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i hele Lolland Kommune'
                    role='img'
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='block'>
          <div className='content'>
            <h1>Fakta om ejerforhold i Lolland Kommune</h1>
          </div>
          <div className='columns'>
            <div className='column is-two-fifths'>
              <div id='ownership-table' className='ownership-legend'></div>
              <div className='content'>
                {/* <!-- <p id='text-fra-js'></p> --> */}
                <p>
                  Ejerforhold er beregnet på baggrund af ESR, herunder
                  ejerforholdkode
                </p>
                <p>
                  Kategorien 'Andet' indeholder koderne 40, 70, 80, 90, 99, 0 og
                  evt. blandede ejerforhold
                </p>
              </div>
            </div>
            <div className='column'>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='ownership-naksov-stackedbar'
                    className='ownership'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='ownership-maribo-stackedbar'
                    className='ownership'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='ownership-roedby-stackedbar'
                    className='ownership'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='ownership-lolland-stackedbar'
                    className='ownership'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
              </div>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='ownership-naksov-piechart'
                    className='ownership'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Nakskov'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='ownership-maribo-piechart'
                    className='ownership'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Maribo'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='ownership-roedby-piechart'
                    className='ownership'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Rødby'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='ownership-lolland-piechart'
                    className='ownership'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i hele Lolland Kommune'
                    role='img'
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='block'>
          <div className='content'>
            <h1>Fakta om boligstørrelse i Lolland Kommune</h1>
          </div>
          <div className='columns'>
            <div className='column is-two-fifths'>
              <div
                id='housing-size-table'
                className='housing-size-legend'
              ></div>
              <div className='content'>
                {/* <!-- <p id='text-fra-js'></p> --> */}
                <p>
                  Boligstørrelsen er beregnet ud fra BBR, herunder Enhedens
                  beboelsesareal (Enh_Bebo_Arl) fra enhedsniveauet
                </p>
              </div>
            </div>
            <div className='column'>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='housing-size-naksov-stackedbar'
                    className='housing-size'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-size-maribo-stackedbar'
                    className='housing-size'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-size-roedby-stackedbar'
                    className='housing-size'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-size-lolland-stackedbar'
                    className='housing-size'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
              </div>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='housing-size-naksov-piechart'
                    className='housing-size'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Nakskov'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-size-maribo-piechart'
                    className='housing-size'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Maribo'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-size-roedby-piechart'
                    className='housing-size'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Rødby'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-size-lolland-piechart'
                    className='housing-size'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i hele Lolland Kommune'
                    role='img'
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='block'>
          <div className='content'>
            <h1>Fakta om boligalder i Lolland Kommune</h1>
          </div>
          <div className='columns'>
            <div className='column is-two-fifths'>
              <div id='housing-age-table' className='housing-age-legend'></div>
              <div className='content'>
                {/* <!-- <p id='text-fra-js'></p> --> */}
                <p>
                  Boligens alder er beregnet udfra BBR, herunder Opførelsesår
                  (Opfoerelse_Aar) fra bygningsniveauet
                </p>
              </div>
            </div>
            <div className='column'>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='housing-age-naksov-stackedbar'
                    className='housing-age'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-age-maribo-stackedbar'
                    className='housing-age'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-age-roedby-stackedbar'
                    className='housing-age'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-age-lolland-stackedbar'
                    className='housing-age'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
              </div>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='housing-age-naksov-piechart'
                    className='housing-age'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Nakskov'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-age-maribo-piechart'
                    className='housing-age'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Maribo'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-age-roedby-piechart'
                    className='housing-age'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Rødby'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='housing-age-lolland-piechart'
                    className='housing-age'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i hele Lolland Kommune'
                    role='img'
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='block'>
          <div className='content'>
            <h1>Fakta om husstand størrelse i Lolland Kommune</h1>
          </div>
          <div className='columns'>
            <div className='column is-two-fifths'>
              <div
                id='household-size-table'
                className='household-size-legend'
              ></div>
              <div className='content'>
                {/* <!-- <p id='text-fra-js'></p> --> */}
                <p>
                  Husstand størrelsen beregnes udfra KMD P-data og BBR, vha.
                  sammenstilling på adressen (KVHX)
                </p>
              </div>
            </div>
            <div className='column'>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='household-size-naksov-stackedbar'
                    className='household-size'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='household-size-maribo-stackedbar'
                    className='household-size'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='household-size-roedby-stackedbar'
                    className='household-size'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='household-size-lolland-stackedbar'
                    className='household-size'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
              </div>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='household-size-naksov-piechart'
                    className='household-size'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Nakskov'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='household-size-maribo-piechart'
                    className='household-size'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Maribo'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='household-size-roedby-piechart'
                    className='household-size'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Rødby'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='household-size-lolland-piechart'
                    className='household-size'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i hele Lolland Kommune'
                    role='img'
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='block'>
          <div className='content'>
            <h1>Fakta om udlejningsforhold i Lolland Kommune</h1>
          </div>
          <div className='columns'>
            <div className='column is-two-fifths'>
              <div
                id='rental-conditions-table'
                className='rental-conditions-legend'
              ></div>
              <div className='content'>
                {/* <!-- <p id='text-fra-js'></p> --> */}
                <p>
                  Udlejningsforhold beregnes udfra KMD P-data, ESR og BBR, ved
                  henholdsvis sammenstilling på adressen og via ESR-nummer
                </p>
              </div>
            </div>
            <div className='column'>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='rental-conditions-naksov-stackedbar'
                    className='rental-conditions'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='rental-conditions-maribo-stackedbar'
                    className='rental-conditions'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='rental-conditions-roedby-stackedbar'
                    className='rental-conditions'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='rental-conditions-lolland-stackedbar'
                    className='rental-conditions'
                    width='100'
                    height='100'
                    aria-label='Graf over antal tomme grunde, ubeboede og beboede sommerhuse'
                    role='img'
                  ></canvas>
                </div>
              </div>
              <div className='columns'>
                <div className='column is-3'>
                  <canvas
                    id='rental-conditions-naksov-piechart'
                    className='rental-conditions'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Nakskov'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='rental-conditions-maribo-piechart'
                    className='rental-conditions'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Maribo'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='rental-conditions-roedby-piechart'
                    className='rental-conditions'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i Rødby'
                    role='img'
                  ></canvas>
                </div>
                <div className='column is-3'>
                  <canvas
                    id='rental-conditions-lolland-piechart'
                    className='rental-conditions'
                    width='200'
                    height='200'
                    aria-label='Graf over boligtyper i hele Lolland Kommune'
                    role='img'
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='block'>
          <div className='content'>
            <h1>Fakta om boliger uegnet til beboelse i Lolland Kommune</h1>
          </div>
          <div className='columns'>
            <div
              id='condemnation-table'
              className='condemnation-legend column is-6'
            ></div>
            <div className='column'>
              <div className='content'>
                {/* <!-- <p id='text-fra-js'></p> --> */}
                <p>
                  Egnethed til beboelse beregnes udfra BBR, Kode for Kondemneret
                  boligenhed (BoligKondemKode) fra enhedsniveauet
                </p>
                <p>
                  Samt Lolland Kommunes egne registreringer af nedrevne boliger
                </p>
                {/* <!-- <p>Boligtypen er beregnet på baggrund af BBR, her udfra enhedens anvendels i BBR.</p> -->
                            <!-- <p>Tæt/lavt bebyggelse udgøres af EnhAnvendelseKode 130, 131 og 132 i BBR.</p> -->
                            <!-- <p>Andet udgøres af EnhAnvendelseKode 121, 150, 160 og 190 i BBR.</p> -->
                            <!-- <p>EnhAnvendelseKode større end 180 er ikke medtaget i analysen med undtagelse af EnhAnvendelseKode 190 i BBR.</p> --> */}
              </div>
            </div>
          </div>
        </div>

        <div className='block'>
          <div className='content'>
            <h1>Fakta om Staus på boliger i Lolland Kommune</h1>
          </div>
          <div className='columns'>
            <div id='status-table' className='status-legend column is-6'></div>
            <div className='column'>
              <div className='content'>
                {/* <!-- <p id='text-fra-js'></p> --> */}
                <p>
                  Flexboligstatus beregnes udfra BBR, Kode for
                  Flexboligtilladelsesart (FlexboligTilladelsesartKode) fra
                  enhedsniveauet
                </p>
                <p>
                  Tom helårsbeboelse uden flexbolig beregnes udfra BBR og KMD
                  P-data, vha. sammenstilling på adresse.
                </p>
                <p>
                  Sommerhus og beboede sommerhus beregnes udfra BBR og KMD
                  P-data, vha. sammenstilling på adresse og sortering på
                  EnhAnvendelseKode (510)
                </p>
                {/* <!-- <p>Boligtypen er beregnet på baggrund af BBR, her udfra enhedens anvendels i BBR.</p> -->
                            <!-- <p>Tæt/lavt bebyggelse udgøres af EnhAnvendelseKode 130, 131 og 132 i BBR.</p> -->
                            <!-- <p>Andet udgøres af EnhAnvendelseKode 121, 150, 160 og 190 i BBR.</p> -->
                            <!-- <p>EnhAnvendelseKode større end 180 er ikke medtaget i analysen med undtagelse af EnhAnvendelseKode 190 i BBR.</p> --> */}
              </div>
            </div>
          </div>
        </div>

        <div className='block'>
          <div className='content'>
            <h1>Fakta om Beliggenhed af boliger i Lolland Kommune</h1>
          </div>
          <div className='columns'>
            <div id='location-table' className='location-legend column is-6'>
              <table className='table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow'>
                <thead>
                  <tr>
                    <th>Beliggenhed</th>
                    <th>
                      <abbr title='Hele Lolland Kommune'>I alt</abbr>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='has-text-left content'>
                      Færre end 1000 indbyggere
                    </td>
                    <td className='has-text-right content'>2.142</td>
                  </tr>
                  <tr>
                    <td className='has-text-left content'>
                      1000 – 4999 indbyggere
                    </td>
                    <td className='has-text-right content'>3.616</td>
                  </tr>
                  <tr>
                    <td className='has-text-left content'>
                      5000 – 9999 indbyggere
                    </td>
                    <td className='has-text-right content'>9.864</td>
                  </tr>
                  <tr>
                    <td className='has-text-left content'>Landdistrikt</td>
                    <td className='has-text-right content'>8.755</td>
                  </tr>
                  <tr>
                    <th className='has-text-left content'>SUM</th>
                    <th className='has-text-right content'>24.377</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='column'>
              <div className='content'>
                {/* <!-- <p id='text-fra-js'></p> --> */}
                <p>Beliggenhed er beregnet ud fra KMD P-data, Zonekort, BBR</p>
                <p>
                  By størrelse er beregnet som antallet af personer med adresse
                  i sammenhængende byzoner eller tætliggende byzoner
                </p>
                <p>
                  Tallet for beliggenhed viser antallet af boligenheder i
                  sammenhængende byzoner kategoriseret efter antallet af
                  beboere.
                </p>
                {/* <!-- <p>Boligtypen er beregnet på baggrund af BBR, her udfra enhedens anvendels i BBR.</p> -->
                            <!-- <p>Tæt/lavt bebyggelse udgøres af EnhAnvendelseKode 130, 131 og 132 i BBR.</p> -->
                            <!-- <p>Andet udgøres af EnhAnvendelseKode 121, 150, 160 og 190 i BBR.</p> -->
                            <!-- <p>EnhAnvendelseKode større end 180 er ikke medtaget i analysen med undtagelse af EnhAnvendelseKode 190 i BBR.</p> --> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HousingMarketPage;
