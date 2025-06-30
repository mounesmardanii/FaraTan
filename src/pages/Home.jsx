import React from 'react'
import Header from '../components/Landing/Header'
import HeaderText from '../components/Landing/HeaderText'
import AboutUs from '../components/Landing/AboutUs'
import TrainingPackages from '../components/Landing/TrainingPackages'
import AuthPromptSection from '../components/Landing/AuthPromptSection'
import ScrollToTopButton from '../components/Landing/ScrollToTopButton';

function Home() {
  return (
    <div>
      <Header />
      <HeaderText />
      <AboutUs />
      <TrainingPackages />
      <AuthPromptSection />
      <ScrollToTopButton />
    </div>
  );
}
export default Home;

