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
      className="relative w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col overflow-hidden"
      style={{ width: '100%', maxWidth: '430px', height: '932px' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Floral Decoration - Top Right */}
      <div className="absolute -top-8 -right-8 w-56 h-56 opacity-70 z-0">
        <FloralDecoration imageType="arranjo1" />
      </div>

      {/* Top Floral Decoration - Top Left (inverted) */}
      <div className="absolute -top-8 -left-8 w-56 h-56 opacity-70 z-0" style={{ transform: 'scaleX(-1)' }}>
        <FloralDecoration imageType="arranjo1" />
      </div>

      {/* Bottom Floral Decoration - Bottom Left */}
      <div className="absolute -bottom-8 -left-8 w-48 h-48 opacity-70 z-0">
        <FloralDecoration imageType="arranjo2" />
      </div>

      {/* Bottom Floral Decoration - Bottom Right (inverted) */}
      <div className="absolute -bottom-8 -right-8 w-48 h-48 opacity-70 z-0" style={{ transform: 'scaleX(-1)' }}>
        <FloralDecoration imageType="arranjo2" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-start h-full px-4 pt-16 pb-6">
        {/* Blessing Text */}
        <motion.div
          className="text-center mb-4 mt-4"
          variants={itemVariants}
        >
          <p className="text-wedding-gray text-sm font-serif font-light tracking-wide">
            Com a bênção de Deus e de seus pais
          </p>
        </motion.div>

        {/* Names - Elegant Romantic Logo */}
        <motion.div
          className="text-center mb-4 relative w-full flex flex-col items-center justify-center px-4"
          variants={itemVariants}
        >
          <div className="relative flex items-center justify-center w-full py-6 min-h-[280px]">
            {/* Large translucent ampersand in background with heart */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="relative">
                <span className="font-cursive text-[16rem] text-soft-gray font-light leading-none opacity-100" style={{ color: '#E8E8E8' }}>
                  &
                </span>
                {/* Red heart at the position indicated by the arrow */}
                <motion.div
                  className="absolute top-[15%] right-[1%] left-[110%]"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                >
                  <HeartIcon className="w-8 h-8 text-wedding-rose" />
                </motion.div>
              </div>
            </div>

            {/* Names in elegant calligraphy */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-2">
              {/* First name */}
              <h1 className="ballet-font text-7xl text-wedding-gray leading-[1.1] tracking-tight -ml-12" style={{ color: '#4A4A4A', letterSpacing: '-0.02em' }}>
                Andreza
              </h1>

              {/* Second name */}
              <h1 className="ballet-font text-7xl text-wedding-gray leading-[1.1] tracking-tight ml-12" style={{ color: '#4A4A4A', letterSpacing: '-0.02em' }}>
                Eduardo
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Invitation Text */}
        <motion.div
          className="text-center mb-6"
          variants={itemVariants}
        >
          <p className="text-wedding-gray text-sm font-serif leading-relaxed font-light">
            Convidam para cerimônia de seu<br />
            <span className="font-medium tracking-wider">CASAMENTO</span> à realizar-se no dia:
          </p>
        </motion.div>

        {/* Date Section */}
        <motion.div
          className="text-center mb-12 px-2 w-full"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center max-w-[400px] mx-auto">
            {/* Day of Week - Above with decorative dots */}
            <div className="relative flex items-center justify-center gap-2 mb-3">
              {/* Left decorative dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-wedding-rose"></div>
              <p className="text-wedding-gray text-xs font-serif uppercase tracking-[0.3em] font-normal" style={{ transform: 'perspective(100px) rotateX(-5deg)' }}>
                SÁBADO
              </p>
              {/* Right decorative dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-wedding-rose"></div>
            </div>

            {/* Main Date Layout - Horizontal */}
            <div className="relative flex items-center justify-center gap-4 w-full px-2">
              {/* Month - Left */}
              <div className="flex flex-col items-end flex-1 max-w-[100px]">
                <p className="text-wedding-gray text-xs font-serif uppercase tracking-[0.25em] font-normal mb-2">
                  JANEIRO
                </p>
                {/* Decorative line extending right */}
                <div className="w-12 h-px bg-wedding-gray opacity-20"></div>
              </div>

              {/* Central Day Number */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col items-center flex-shrink-0"
              >
                <h2 className="text-6xl font-serif text-wedding-gray font-normal leading-none tracking-tight">
                  03
                </h2>
              </motion.div>

              {/* Year - Right */}
              <div className="flex flex-col items-start flex-1 max-w-[100px]">
                <p className="text-wedding-gray text-xs font-serif font-light mb-2">
                  2026
                </p>
                {/* Decorative line extending left */}
                <div className="w-12 h-px bg-wedding-gray opacity-20"></div>
              </div>
            </div>

            {/* Time - Below */}
            <div className="mt-2">
              <p className="text-wedding-gray text-sm font-serif font-light tracking-wide">
                às 17 horas
              </p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Icons Section */}
        <motion.div
          className="text-center mb-4 w-full"
          variants={itemVariants}
        >
          <div className="flex justify-center items-center gap-3 flex-nowrap px-2">
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

