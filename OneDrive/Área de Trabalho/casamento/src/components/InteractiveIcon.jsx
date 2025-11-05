import { motion } from 'framer-motion'

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

const iconMap = {
  location: LocationIcon,
  check: CheckIcon,
  gift: GiftIcon,
}

const InteractiveIcon = ({ iconType, label, onClick }) => {
  const IconComponent = iconMap[iconType]
  
  return (
    <motion.button
      className="flex flex-col items-center gap-3 focus:outline-none group"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-wedding-pink flex items-center justify-center shadow-sm transition-all duration-300 group-hover:bg-wedding-rose group-hover:shadow-md"
      >
        <motion.div
          className="text-wedding-gray group-hover:text-white transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
        >
          {IconComponent && <IconComponent />}
        </motion.div>
      </motion.div>
      <p className="text-wedding-gray text-xs md:text-sm font-light text-center max-w-[100px] md:max-w-[120px] leading-tight">
        {label}
      </p>
    </motion.button>
  )
}

export default InteractiveIcon
