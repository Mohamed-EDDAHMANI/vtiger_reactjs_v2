import React from 'react'
import { useState, useEffect } from 'react'
import Popap from './components/Popup'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const contactId = '2';
  const fetchData = () => {
    fetch(`http://localhost/vtigercrm2/api.php?id=${contactId}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
        console.log(data);
      });
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  return (
    <div className='w-full h-full bg-gray-500/50 m-0 p-0'>
      <div>
        <button className='bg-blue-500/75 text-white text-center px-4 py-2 rounded-md text-xl' onClick={() => setIsOpen(!isOpen)}>Click me</button>
      </div>
      {isOpen && data && (
        // <Card keys={keys} data={data} isOpen={isOpen}/>
        <Popap data={data} isOpen={isOpen} setIsOpen={setIsOpen} fetchData={fetchData}/>
      )}
    </div>
  )
}

export default App
