import {
  CopyIcon,
	FacebookIcon,
	InstagramIcon,
	TelegramIcon,
	WhatsAppIcon,
  XIcon
} from "@/icons/icons"
import Button from "./Button"
import { useState } from "react";

interface ShareModalProps {
	onClose: () => void
	shareUrl: string
}

function ShareModal({ onClose, shareUrl }: ShareModalProps) {
	const [copySuccess, setCopySuccess] = useState(false);

	const platforms = {
		whatsapp: {
			url: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
			icon: <WhatsAppIcon className='text-green-500' />
		},
		facebook: {
			url: `https://www.messenger.com`,
      icon: <FacebookIcon className='text-blue-600' />
		},
		instagram: {
			url: `https://www.instagram.com`,
			icon: <InstagramIcon className='text-pink-500' />
		},
		telegram: {
			url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
			icon: <TelegramIcon className='text-blue-400' />
		}
	}

	const handleShare = (url: string) => {
		window.open(url, "_blank")
    handleCopy()
	}

  const handleCopy = () => {
		navigator.clipboard.writeText(shareUrl);
		setCopySuccess(true);
		setTimeout(() => setCopySuccess(false), 2000);
	};

	return (
    
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-black/50 max-h-screen flex justify-center items-center z-20'>
  
		  <section className='flex flex-col bg-storm-50 dark:bg-storm-950 rounded-xl max-w-xs sm:max-w-md w-full'>
        <header className='flex justify-between items-center p-5 border-b border-seagreen-950/40 dark:border-white/20'>
          <h3 className='text-lg sm:text-2xl font-semibold text-ellipsis'>Comparte el enlace con tus amigos</h3>
          <button onClick={() => onClose()}>
            <XIcon />
          </button>
        </header>
        <div className='flex flex-col gap-5 p-5'>
          <div className='flex m-auto gap-2'>
            {Object.entries(platforms).map(([platform, { url, icon }]) => (
              <Button
                key={platform}
                onClick={() => handleShare(url)}
                className='p-2 size-10'
                shape="full"
                isOnlyIcon={true}
              >
                {icon}
              </Button>
            ))}
          </div>
          <div className="flex items-center justify-between py-1 px-3 bg-storm-200 rounded-lg dark:bg-storm-900">
						<span className="truncate">{shareUrl}</span>
						<Button onClick={handleCopy} variant="ghost" className="hover:bg-storm-100/10 p-2">
							<CopyIcon className="dark:text-storm-200" />
						</Button>
					</div>
					{copySuccess && (
						<span className="text-lima-500 text-center">¡Enlace copiado!</span>
					)}
        </div>
      </section>
		</div>
	)
}

export default ShareModal
