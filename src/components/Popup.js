const Popup = ({selectedHouse, setSelectedHouse}) => {
    return(
        <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-4 overflow-auto z-20">
        <button
          onClick={() => setSelectedHouse(null)}
          className="mb-4 text-red-500"
        >
          Close
        </button>
        <h2 className="text-xl font-bold mb-2">
          {selectedHouse.Address || "House Details"}
        </h2>
        {/* Render additional house details here */}
        <p>Price: {selectedHouse.Price}</p>
        <p>Bedrooms: {selectedHouse.Bed_number}</p>
        <p>Bathrooms: {selectedHouse.Bath_number}</p>
        {/* ... */}
      </div>
    );
}

export default Popup;