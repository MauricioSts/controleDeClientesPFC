import arranjo1Image from '../arranjo1.png'
import arranjo2Image from '../arranjo2.png'

const FloralDecoration = ({ imageType = 'arranjo2' }) => {
  const imageSrc = imageType === 'arranjo1' ? arranjo1Image : arranjo2Image
  
  return (
    <img
      src={imageSrc}
      alt="Arranjo floral decorativo"
      className="w-full h-full object-contain"
    />
  )
}

export default FloralDecoration

