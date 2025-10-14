

export default function CartPopup() {
    return (
        <div className="w-full not-sm:max-w-11/12 sm:max-w-md px-8 py-10 rounded-lg border pointer-events-auto"
            style={{
                backgroundColor: "#1a1a1a",
                borderColor: "#362222",
            }}>
            <h2 className="text-3xl font-bold text-white mb-2">YOUR CART</h2>
            <p className="text-gray-400 text-sm mb-8">Items you intend to purchase</p>
            <div className="text-white">Cart functionality coming soon!</div>
        </div>
    );
}