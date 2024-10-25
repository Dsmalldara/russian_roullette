/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Wheel } from 'react-custom-roulette'
import Template from './RoulletteTemplate'
import RRLOGO2 from "../../assets/RR2.png"
import WelcomeComponent from './Welcome'
import { Toaster, toast } from 'sonner'
import {soundManager} from "../../lib/soundManager.ts"

import { initializeWebApp } from '@/Authenticator.ts'
import NumberRangeGrid from './NumberRange.tsx'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
// You can download these sounds and save them in your assets folder

function PlayScreen() {
    const [mustSpin, setMustSpin] = useState(false)
    const [prizeNumber, setPrizeNumber] = useState(0)
    const [showAuthDialog, setShowAuthDialog] = useState(false)
    const [userdata,setUserdata] = useState("")
    const latestWin = 7
    
    const spinSound = new Audio("https://assets.mixkit.co/active_storage/sfx/146/146-preview.mp3")
    const winSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3")
    useEffect(() => {
      // Initialize the WebApp and set the user data
      const user = initializeWebApp();
        setUserdata(user?.username || "")
    }, [userdata]);
  
    // Preload sounds
    useEffect(() => {
        spinSound.load()
        winSound.load()
    }, [])

    const playerNames = [
      "KyroLexo",
      "märtinho",
      "TFT Zenox",
      "Ryzeyyy",
      "Azähir",
      "VoltrixPro",
      "Syndraaa",
      "LuxAndMorg",
      "Därkness",
      "Nüjablade",
      "Kaynzyyy",
      "AstraalTFT",
      "Jinxxed",
      "Zëphyr",
      "krönen",
      "TFT Mystic",
      "Vorpalxx",
      "Rüneterran"
    ]
  // Get two random names from the array
  const getRandomPlayers = () => {
      const shuffled = [...playerNames].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 2)
  }
  const [randomPlayers] = useState(getRandomPlayers())
  const data = [
    { option: randomPlayers[0].slice(0, 9) },
    { option: randomPlayers[1].slice(0, 9)},
    { option: userdata ? `${userdata} (You)` : 'Player three' },
  ]

    const handleSpinClick = () => {
      if (!userdata) {
        setShowAuthDialog(true)
        return
      }
      if (!mustSpin) {
        const newPrizeNumber = Math.floor(Math.random() * data.length)
        setPrizeNumber(newPrizeNumber)
        setMustSpin(true)
        soundManager.play('spin')
      }
    }

    const handleStopSpinning = () => {
      setMustSpin(false)
      const winner = data[prizeNumber].option
      
      soundManager.stop('spin')
      soundManager.play('win')
      toast.custom((t: any) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-[#1D1B4D] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">
                  Winner Announcement!
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  {winner} has won the spin!
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-center',
      })
    }
    return (
      <Template>
          <Toaster richColors />
          <div className='min-h-screen max-w-4xl mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8'>
              {/* Header Section */}
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogContent className="sm:max-w-[425px] bg-[#1D1B4D] text-white">
                  <DialogHeader>
                    <DialogTitle>Authentication Required</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Please sign in to play the game and win amazing prizes!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col space-y-4 mt-4">
                    <p className="text-sm text-gray-300">
                      Sign in to:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Spin the wheel</li>
                        <li>Win TON tokens</li>
                        <li>Track your winnings</li>
                        <li>Compete with other players</li>
                      </ul>
                    </p>
                    <button
                      onClick={() => setShowAuthDialog(false)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Got it
                    </button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className='w-full relative'>
                  <WelcomeComponent data={userdata}/>
                  <img 
                      src={RRLOGO2} 
                      alt="logo" 
                      className="absolute top-4 right-3 h-14 w-14"
                  />
              </div>
  
              {/* Content Section */}
              <div className='w-full text-center mt-[5rem] space-y-4'>
                  <p className='font-bold text-xl text-white'>
                      <span className='text-red-600'>WIN</span> or LOSE
                  </p>
                  <p className='text-xs text-white'>
                      Select a number pool and stand a chance to 
                      <span className='text-red-600'> WIN BIG !!!</span>
                  </p>
                  <p className='text-white'>
                      0x***cb0u0d.. Just won 
                      <span className='text-red-600 font-bold'> {latestWin || 10} TON</span>
                  </p>
                  <div className='text-sm font-semibold text-white'>
                      <p>Click spin after selecting a number pool</p>
                  </div>
              </div>
              <div className="w-full mt-6">
                <NumberRangeGrid />
              </div>
              {/* Wheel Section */}
              <div className='w-full flex justify-center items-center mt-8 mb-8'>
                  <div className='relative w-full max-w-[300px] aspect-square'>
                      {/* Marker */}
                      {/* <div className='absolute top-0 left-1/2 -translate-x-1/2 z-10 w-8 h-8'>
                          <img src={whiteMarker} alt="" className="marker"/>
                      </div>
                       */}
                      {/* Wheel */}
                      <div className='w-full h-full'>
                          <Wheel
                              mustStartSpinning={mustSpin}
                              prizeNumber={prizeNumber}
                              data={data}
                              onStopSpinning={handleStopSpinning}
                              backgroundColors={['#FF4136','#89100a','#ce1e14',]}
                              textColors={['#FFFFFF']}
                              outerBorderColor="#FF4136"
                              outerBorderWidth={5}
                              innerRadius={40}
                              innerBorderColor="#1D1B4D"
                              innerBorderWidth={5}
                              radiusLineColor="#1D1B4D"
                              radiusLineWidth={2}
                              fontSize={16}
                              textDistance={65}
                          />
                      </div>
  
                      {/* Spin Button */}
                      <button 
                          onClick={handleSpinClick}
                          disabled={mustSpin}
                          className={`
                              absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                              bg-[#1D1B4D] text-white rounded-full
                              w-20 h-20 font-bold z-10
                              transition-all duration-200
                              hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-red-600
                              ${mustSpin ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                          `}
                      >
                        <p className='text-sm'>
                        {mustSpin ? 'SPINNING...' : 'SPIN'}
                        </p>
                      </button>
                  </div>
              </div>
          </div>
      </Template>
  )
  }

export default PlayScreen