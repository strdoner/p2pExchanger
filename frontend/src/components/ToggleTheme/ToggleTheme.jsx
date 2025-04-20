import React from 'react'

const ToggleTheme = ({ value, onChange }) => (
    <a
      onClick={onChange}
      checked={value}
      readOnly
      className='nav-link'
    >{
      value === 0 ?
      <i class="bi bi-brightness-high-fill"></i>
      :
      <i class="bi bi-moon-fill"></i>
      
    }</a>  
)

export default ToggleTheme