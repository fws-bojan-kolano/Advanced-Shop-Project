import { useState } from 'react';
import './rays.scss';

export default function Rays() {

    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(prev => !prev);
    }

    return (
        <div className={`rays ${isChecked ? 'dark-mode' : ''}`}>
            <div className='rays__hero'></div>
            <div className='rays__content'>
                <h1 data-text='An awesome title'>Shiny colors aren't they? <br /> Try pressing the button bellow!</h1>
                <input type='checkbox' id='switch' onChange={handleToggle} />
                <label htmlFor='switch'><span>Switch</span></label>
            </div>
        </div>
    )
}