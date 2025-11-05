import { motion } from 'framer-motion'
import FloralDecoration from './FloralDecoration'
import InteractiveIcon from './InteractiveIcon'
import HeartIcon from './HeartIcon'

const WeddingInvitation = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      className="relative w-full max-w-lg lg:max-w-2xl mx-auto bg-[#FAFAFA] min-h-screen flex flex-col overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Floral Decoration - Top Right */}
      <div className="absolute -top-12 -right-12 md:-top-16 md:-right-16 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 opacity-70 z-0">
        <FloralDecoration imageType="arranjo1" />
      </div>

      {/* Bottom Floral Decoration - Bottom Left */}
      <div className="absolute -bottom-12 -left-12 md:-bottom-16 md:-left-16 w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 opacity-70 z-0">
        <FloralDecoration imageType="arranjo2" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-10 md:px-8 md:py-16">
        {/* Blessing Text */}
        <motion.div
          className="text-center mb-4 md:mb-6 mt-4 md:mt-6"
          variants={itemVariants}
        >
          <p className="text-wedding-gray text-sm md:text-base font-light tracking-wide">
            Com a bênção de Deus e de seus pais
          </p>
        </motion.div>

        {/* Names */}
        <motion.div
          className="text-center mb-6 md:mb-8 relative w-full flex flex-col items-center px-4"
          variants={itemVariants}
        >
          <div className="relative flex flex-col items-center max-w-4xl">
            <h1 className="font-cursive text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] text-wedding-gold leading-[0.85] mb-1 drop-shadow-lg tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1), 0 0 20px rgba(212, 175, 55, 0.3)' }}>
              Andreza
            </h1>
            <div className="relative -mt-2 md:-mt-3 mb-1 flex items-center justify-center">
              <span className="font-cursive text-3xl md:text-5xl lg:text-6xl text-wedding-gold-light font-light relative inline-block opacity-90">
                e
                <motion.span
                  className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-wedding-rose"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                >
                  <HeartIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </motion.span>
              </span>
            </div>
            <h1 className="font-cursive text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] text-wedding-gold leading-[0.85] drop-shadow-lg tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1), 0 0 20px rgba(212, 175, 55, 0.3)' }}>
              Eduardo
            </h1>
          </div>
        </motion.div>

        {/* Invitation Text */}
        <motion.div
          className="text-center mb-4 md:mb-6"
          variants={itemVariants}
        >
          <p className="text-wedding-gray text-sm md:text-base leading-relaxed font-light">
            Convidam para cerimônia de seu<br />
            <span className="font-medium tracking-wider">CASAMENTO</span> à realizar-se no dia:
          </p>
        </motion.div>

        {/* Date Section */}
        <motion.div
          className="text-center mb-6 md:mb-8 px-4 w-full"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center max-w-md mx-auto">
            {/* Decorative Line Top */}
            <div className="w-16 md:w-20 h-px bg-wedding-gray opacity-30 mb-6 md:mb-8"></div>
            
            {/* Day of Week */}
            <p className="text-wedding-gray text-xs md:text-sm font-serif uppercase tracking-[0.3em] mb-4 md:mb-6 font-normal">
              SÁBADO
            </p>

            {/* Date - Day Number */}
            <motion.div
              className="mb-4 md:mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-serif text-wedding-gray font-normal leading-none tracking-tight">
                03
              </h2>
            </motion.div>

            {/* Month and Year */}
            <div className="flex flex-col items-center gap-1 md:gap-2 mb-4 md:mb-6">
              <p className="text-wedding-gray text-sm md:text-base font-serif uppercase tracking-[0.25em] font-normal">
                JANEIRO
              </p>
              <p className="text-wedding-gray text-sm md:text-base font-serif font-light">
                2026
              </p>
            </div>

            {/* Time */}
            <div className="mb-4 md:mb-6">
              <p className="text-wedding-gray text-base md:text-lg font-serif font-light tracking-wide">
                às 17 horas
              </p>
            </div>

            {/* Decorative Line Bottom */}
            <div className="w-16 md:w-20 h-px bg-wedding-gray opacity-30"></div>
          </div>
        </motion.div>

        {/* Interactive Icons Section */}
        <motion.div
          className="text-center mb-6 md:mb-8 w-full"
          variants={itemVariants}
        >
          <div className="flex justify-center items-center gap-4 md:gap-6 lg:gap-8 flex-nowrap px-4">
            <InteractiveIcon
              iconType="location"
              label="Como chegar"
              onClick={() => console.log('Como chegar')}
            />
            <InteractiveIcon
              iconType="check"
              label="Confirme sua presença"
              onClick={() => console.log('Confirmar presença')}
            />
            <InteractiveIcon
              iconType="gift"
              label="Lista de presentes"
              onClick={() => console.log('Lista de presentes')}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WeddingInvitation

