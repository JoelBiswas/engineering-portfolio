import React from 'react'
import Arrow from '../images/home/arrow.png'
import CircularHero from './CircularHero'

const Home = () => {
  return (
    <div id='home' className='flex justify-evenly flex-gap-3 items-center mx-4 md:ml-24 pt-24 flex-col md:flex-row'>
      <div className='w-full md:w-2/3 flex flex-col justify-center items-center'>
        <div>
          <h1 className='text-left'>Hey,</h1>
          <div className='flex gap-3'>
            <h1>I am
              <span className='text-[var(--primary)] ml-2 text-[46px]'>Joel Biswas</span></h1>
          </div>
          <div className='hero-roles'>
            <div className='hero-roles-track'>
              <h2 className='mt-1 text-xl md:text-2xl lg:text-3xl opacity-15'>Electrical Engineering Student</h2>
              <h2 className='mt-1 text-xl md:text-2xl lg:text-3xl opacity-15'>Robotics Enthusiast</h2>
              <h2 className='mt-1 text-xl md:text-2xl lg:text-3xl opacity-15'>PCB Designer</h2>
              <h2 className='mt-1 text-xl md:text-2xl lg:text-3xl opacity-15'>Embedded Systems Developer</h2>
              <h2 className='mt-1 text-xl md:text-2xl lg:text-3xl opacity-15'>RTL Designer</h2>
              <h2 className='mt-1 text-xl md:text-2xl lg:text-3xl opacity-15'>Chip Design Enthusiast</h2>
              <h2 className='mt-1 text-xl md:text-2xl lg:text-3xl opacity-15'>Electrical Engineering Student</h2>
            </div>
          </div>
          <p className='mt-6 md:mt-4 leading-6 text-[18px] max-w-[370px]'>I am an electrical engineering student at Georgia Tech exploring robotics and chip design. From a custom R2-D2 and wireless controller to a RISC-V processor core, I build hardware through embedded systems, digital logic, and hands-on engineering.</p>
          <div>
            <a href="#projects">
              <div className='flex justify-center align-middle rounded-sm bg-[var(--primary)] w-[150px] h-[42px] my-4 px-2 py-2 drop-shadow-custom  hover:scale-[120%] transition-transform duration-300 ease-in-out'>
                <p className='text-[var(--light)] text-xl text-center mr-4'>Projects</p>
                <img src={Arrow} alt='Forward Arrow' className='w-[30px] h-[20px] mt-1'/>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className='w-full my-6 md:my-0 flex justify-center items-center'>
        <CircularHero />
      </div>
    </div>
  )
}

export default Home