import React, { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import './app.scss';

import HeroNavigation from '../heronavigation/HeroNavigation';
import SummerHousePage from '../../pages/SummerHouse';
import MovingPatternsPage from '../../pages/MovingPatterns';
import FlexHousePage from '../../pages/FlexHouse';
import DemographicsPage from '../../pages/Demographics';
import HousingMarketPage from '../../pages/HousingMarket';
import AccidentsPage from '../../pages/Accidents';
import ResidentAgesPage from '../../pages/ResidentAges';
import VillagesPage from '../../pages/Villages';
import HeatPlanPage from '../../pages/HeatPlan';


const App: FC = () => {
    return (
        <>		
            <section className='hero is-info is-small'>
                <HeroNavigation />
            </section>
		    <section className='section'>
                <Routes>
                    <Route path='/'>                    
                        <Route index element={<SummerHousePage />} />
                        <Route path='/sommerhus' element={<SummerHousePage />} />
                        <Route path='/flyttemonstre' element={<MovingPatternsPage />} />
                        <Route path='/flexbolig' element={<FlexHousePage />} />
                        <Route path='/demografi' element={<DemographicsPage />} />
                        <Route path='/boligmarked' element={<HousingMarketPage />} />
                        <Route path='/uheld' element={<AccidentsPage />} />
                        <Route path='/boligomrade' element={<ResidentAgesPage />} />
                        <Route path='/landsbyer' element={<VillagesPage />} />
                        <Route path='/varmeplan' element={<HeatPlanPage />} />
                    </Route>
                </Routes>
		    </section>
        </>
    )
}

export default App