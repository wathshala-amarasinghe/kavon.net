import React from 'react';

interface AvatarProps {
    src?: string | null;
    name: string;
    size?: number;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 40, className = '' }) => {
    // Generate initials from name (e.g., "Kavon L" -> "KL")
    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        if (parts.length === 1 && parts[0].length >= 2) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return name.substring(0, 1).toUpperCase() || '?';
    };

    // If we have an avatarUrl from Cloudinary, apply transformations for perfectly cropped face detection.
    const getOptimizedSrc = (url: string) => {
        if (url.includes('cloudinary.com')) {
            // Check if already transformed, otherwise insert transformations
            if (!url.includes('/upload/c_fill')) {
                return url.replace('/upload/', `/upload/c_fill,g_face,w_${size * 2},h_${size * 2},q_auto,f_auto/`);
            }
        }
        return url;
    };

    const style = {
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
    };

    if (src) {
        return (
            <div 
                className={`rounded-full overflow-hidden flex-shrink-0 bg-white/5 border border-white/10 ${className}`} 
                style={style}
            >
                <img 
                    src={getOptimizedSrc(src)} 
                    alt={name} 
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div 
            className={`rounded-full flex-shrink-0 bg-white/5 border border-white/10 flex items-center justify-center text-white font-black tracking-widest ${className}`}
            style={{
                ...style,
                fontSize: Math.max(10, size * 0.35)
            }}
        >
            {getInitials(name)}
        </div>
    );
};

export default Avatar;
