import arranjo1 from '../arranjo1.png'
import arranjo2 from '../arranjo2.png'
import HeartIcon from './HeartIcon'

// SVG Icons
const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
  </svg>
)

const GiftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6H17.82C17.93 5.69 18 5.35 18 5C18 3.34 16.66 2 15 2C13.95 2 13.04 2.54 12.5 3.35L12 4.02L11.5 3.35C10.96 2.54 10.05 2 9 2C7.34 2 6 3.34 6 5C6 5.35 6.07 5.69 6.18 6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM15 4C15.55 4 16 4.45 16 5C16 5.55 15.55 6 15 6C14.45 6 14 5.55 14 5C14 4.45 14.45 4 15 4ZM9 4C9.55 4 10 4.45 10 5C10 5.55 9.55 6 9 6C8.45 6 8 5.55 8 5C8 4.45 8.45 4 9 4ZM20 19H4V13H20V19ZM20 11H4V8H20V11Z" fill="currentColor"/>
  </svg>
)

export default function ConviteCasamento() {
  return (
    <div className="relative w-full max-w-sm mx-auto px-4 bg-white min-h-screen flex flex-col overflow-hidden" style={{ aspectRatio: '9/16' }}>
      {/* Top left floral decoration */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 opacity-80 z-0 drop-shadow-md">
        <img src={arranjo1} alt="Arranjo floral" className="w-full h-full object-contain" />
      </div>

      {/* Bottom right floral decoration - mirrored */}
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 opacity-80 z-0 drop-shadow-md" style={{ transform: 'scaleX(-1)' }}>
        <img src={arranjo2} alt="Arranjo floral" className="w-full h-full object-contain" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-8 space-y-4">
        
        {/* Biblical quote - top */}
        <p className="text-xs italic text-gray-500 text-center mt-4 font-montserrat px-4">
          "Para que todos vejam, saibam, considerem, e compreendam que a mão do Senhor fez isso." — Isaías 41:20
        </p>

        {/* Blessing */}
        <p className="text-sm text-gray-600 text-center mt-2 font-montserrat">
          Com a bênção de Deus
        </p>

        {/* Names section */}
        <div className="relative flex flex-col items-center justify-center w-full py-8 sm:py-12 min-h-[250px] sm:min-h-[300px]">
          {/* Large translucent ampersand in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <span className="font-cursive text-[12rem] sm:text-[16rem] md:text-[20rem] leading-none" style={{ color: '#E8E8E8' }}>
              &
            </span>
          </div>

          {/* Names with ampersand in foreground */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-2">
            {/* First name */}
            <h1 className="font-cursive text-5xl sm:text-6xl md:text-7xl text-gray-700 font-semibold text-center" style={{ color: '#4A4A4A' }}>
              Andreza
            </h1>

            {/* Small ampersand between names */}
            <span className="font-cursive text-2xl sm:text-3xl md:text-4xl text-gray-600 font-light opacity-70" style={{ color: '#4A4A4A' }}>
              &
            </span>

            {/* Second name */}
            <h1 className="font-cursive text-5xl sm:text-6xl md:text-7xl text-gray-700 font-semibold text-center" style={{ color: '#4A4A4A' }}>
              Eduardo
            </h1>
          </div>

          {/* Delicate heart on the large background ampersand */}
          <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 z-20">
            <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#F5AEB4' }} />
          </div>
        </div>

        {/* Invitation text */}
        <p className="text-gray-600 text-sm text-center uppercase tracking-wide font-montserrat px-4 mt-4">
          Convidam para cerimônia de seu<br />
          <span className="font-semibold">CASAMENTO</span> a realizar-se no dia:
        </p>

        {/* Date and time section */}
        <div className="flex flex-col items-center justify-center mt-6 space-y-3">
          {/* Decorative line with month */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-8 h-px" style={{ backgroundColor: '#D6B6A1' }}></div>
            <span className="text-gray-600 text-xs uppercase tracking-wider font-montserrat" style={{ color: '#4A4A4A' }}>
              DEZEMBRO
            </span>
            <div className="w-8 h-px" style={{ backgroundColor: '#D6B6A1' }}></div>
          </div>

          {/* Day circle */}
          <div className="flex flex-col items-center space-y-2">
            {/* Saturday label */}
            <p className="text-gray-600 text-xs uppercase tracking-widest font-montserrat" style={{ color: '#4A4A4A' }}>
              SÁBADO
            </p>

            {/* Date circle */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 flex items-center justify-center bg-white shadow-sm" style={{ borderColor: '#D6B6A1' }}>
              <span className="text-4xl font-bold font-montserrat" style={{ color: '#4A4A4A' }}>
                07
              </span>
            </div>

            {/* Year */}
            <p className="text-gray-600 text-sm font-montserrat" style={{ color: '#4A4A4A' }}>
              2024
            </p>

            {/* Time */}
            <p className="text-gray-600 text-base font-montserrat mt-2" style={{ color: '#4A4A4A' }}>
              16:30H
            </p>
          </div>
        </div>

        {/* Interactive icons section */}
        <div className="flex justify-center items-center gap-4 sm:gap-6 mt-8 mb-8 flex-wrap px-4">
          {/* Location icon */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 flex items-center justify-center" style={{ backgroundColor: '#F8E8E8' }}>
              <LocationIcon className="text-rose-500" style={{ color: '#E6A6AD' }} />
            </div>
            <p className="text-xs text-gray-600 font-medium text-center font-montserrat max-w-[90px]" style={{ color: '#4A4A4A' }}>
              Como Chegar
            </p>
          </div>

          {/* Confirmation icon */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 flex items-center justify-center" style={{ backgroundColor: '#F8E8E8' }}>
              <CheckIcon className="text-rose-500" style={{ color: '#E6A6AD' }} />
            </div>
            <p className="text-xs text-gray-600 font-medium text-center font-montserrat max-w-[90px]" style={{ color: '#4A4A4A' }}>
              Confirme sua presença
            </p>
          </div>

          {/* Gift icon */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full p-3 flex items-center justify-center" style={{ backgroundColor: '#F8E8E8' }}>
              <GiftIcon className="text-rose-500" style={{ color: '#E6A6AD' }} />
            </div>
            <p className="text-xs text-gray-600 font-medium text-center font-montserrat max-w-[90px]" style={{ color: '#4A4A4A' }}>
              Lista de presentes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

