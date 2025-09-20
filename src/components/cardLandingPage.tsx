import { Icon } from 'lucide-react';
import React from 'react';

//esta card es para el landind page en la seccion de caracteristicas y impulsores
function CardLandingPage({ icon, title, description, width, height }: { icon: React.ReactElement<{ className?: string }>; title: string; description: string; width?: string; height?: string }) {  
    return (
        <div className={`w-[${width || 200}px] h-[${height || 200}px] border border-gray-300 rounded-lg p-6 flex flex-col items-center text-center gap-4 hover:shadow-lg transition-shadow duration-300`}>
            {React.isValidElement(icon) && React.cloneElement(icon, { 
                className: `${icon.props.className || ' w-16 h-16 text-blue-500'} mb-4` 
            })}
            <h2 className='text-lg font-semibold'>{title}</h2>
            <p className='text-sm text-gray-600'>{description}</p>
        </div>
    )
}

export { CardLandingPage };