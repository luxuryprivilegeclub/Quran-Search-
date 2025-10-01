import React from 'react';
import type { EditorStyles } from './ImageEditor';
import { UploadIcon } from '../icons/UploadIcon';

interface EditorControlsProps {
    styles: EditorStyles;
    setStyles: React.Dispatch<React.SetStateAction<EditorStyles>>;
}

const backgroundOptions = [
    { name: 'Emerald Night', value: 'linear-gradient(135deg, #2a3a35, #3a2a2a)' },
    { name: 'Royal Gold', value: 'linear-gradient(135deg, #4d3d1f, #1a140a)' },
    { name: 'Deep Ocean', value: 'linear-gradient(135deg, #1f294d, #0a0e1a)' },
    { name: 'Crimson Dawn', value: 'linear-gradient(135deg, #4d1f1f, #1a0a0a)' },
    { name: 'Pure Black', value: '#000000' },
    { name: 'Dark Slate', value: '#1f2937' },
];

const ControlSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-yellow-500 border-b-2 border-yellow-800/50 pb-2 mb-3">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const LabeledControl: React.FC<{ label: string; htmlFor: string; children: React.ReactNode }> = ({ label, htmlFor, children }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);


export const EditorControls: React.FC<EditorControlsProps> = ({ styles, setStyles }) => {

    const handleStyleChange = (key: keyof EditorStyles, value: string | number) => {
        setStyles(prev => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    handleStyleChange('background', `url(${event.target.result})`);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="text-white">
            <ControlSection title="Background">
                <div className="grid grid-cols-3 gap-2">
                    {backgroundOptions.map(opt => (
                        <button
                            key={opt.name}
                            onClick={() => handleStyleChange('background', opt.value)}
                            className={`h-12 w-full rounded-md border-2 transition-all ${styles.background === opt.value ? 'border-yellow-400 scale-105' : 'border-gray-600 hover:border-gray-400'}`}
                            style={{ background: opt.value }}
                            title={opt.name}
                        />
                    ))}
                </div>
                 <label htmlFor="image-upload" className="mt-2 flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-colors">
                    <UploadIcon className="w-5 h-5" />
                    Upload Image
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                 <LabeledControl label={`Background Dimness: ${Math.round(styles.backgroundOverlay * 100)}%`} htmlFor="overlay">
                    <input id="overlay" type="range" min="0" max="0.9" step="0.05" value={styles.backgroundOverlay} onChange={(e) => handleStyleChange('backgroundOverlay', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                </LabeledControl>
            </ControlSection>

            <ControlSection title="Greeting (Optional)">
                <LabeledControl label="Text" htmlFor="greetingText">
                    <input
                        id="greetingText"
                        type="text"
                        placeholder="e.g., Jumma Mubarak"
                        value={styles.greetingText}
                        onChange={(e) => handleStyleChange('greetingText', e.target.value)}
                        className="w-full bg-gray-700 border-2 border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-yellow-500"
                    />
                </LabeledControl>
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="greetingColor" className="text-sm font-medium text-gray-300">Color</label>
                    {/* FIX: Removed invalid '--tw-shadow' property which caused a TypeScript error. */}
                    <input id="greetingColor" type="color" value={styles.greetingColor} onChange={(e) => handleStyleChange('greetingColor', e.target.value)} className="w-10 h-10 bg-transparent rounded-lg cursor-pointer border-none" style={{boxShadow: 'none'}} />
                </div>
                 <LabeledControl label={`Size: ${styles.greetingSize}px`} htmlFor="greetingSize">
                     <input id="greetingSize" type="range" min="30" max="100" value={styles.greetingSize} onChange={(e) => handleStyleChange('greetingSize', parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                </LabeledControl>
            </ControlSection>

            <ControlSection title="Text Colors">
                 <div className="flex items-center justify-between gap-4">
                    <label htmlFor="arabicColor" className="text-sm font-medium text-gray-300">Arabic</label>
                    {/* FIX: Removed invalid '--tw-shadow' property which caused a TypeScript error. */}
                    <input id="arabicColor" type="color" value={styles.arabicColor} onChange={(e) => handleStyleChange('arabicColor', e.target.value)} className="w-10 h-10 bg-transparent rounded-lg cursor-pointer border-none" style={{boxShadow: 'none'}} />
                 </div>
                 <div className="flex items-center justify-between gap-4">
                    <label htmlFor="urduColor" className="text-sm font-medium text-gray-300">Urdu</label>
                    {/* FIX: Removed invalid '--tw-shadow' property which caused a TypeScript error. */}
                    <input id="urduColor" type="color" value={styles.urduColor} onChange={(e) => handleStyleChange('urduColor', e.target.value)} className="w-10 h-10 bg-transparent rounded-lg cursor-pointer border-none" style={{boxShadow: 'none'}} />
                 </div>
            </ControlSection>

            <ControlSection title="Font Sizes">
                <LabeledControl label={`Arabic: ${styles.arabicSize}px`} htmlFor="arabicSize">
                     <input id="arabicSize" type="range" min="30" max="120" value={styles.arabicSize} onChange={(e) => handleStyleChange('arabicSize', parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                </LabeledControl>
                <LabeledControl label={`Urdu: ${styles.urduSize}px`} htmlFor="urduSize">
                     <input id="urduSize" type="range" min="20" max="100" value={styles.urduSize} onChange={(e) => handleStyleChange('urduSize', parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                </LabeledControl>
            </ControlSection>
        </div>
    );
};