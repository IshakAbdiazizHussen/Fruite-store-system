import React from 'react'
import { Users, Star, Phone, Mail, MapPin } from 'lucide-react';

export default function SuppliersPage() {
  return (
    <>
    <div className='p-6'>
       <h3 className='text-2xl'>Suppliers Management</h3>
       <p className='font-light text-gray-500'>Manage your fruit suppliers and contacts</p>
    </div>

    <section className="flex flex-wrap gap-6 w-full px-8 mb-8">
        {/* CARD 1 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <div>
            <Users className="bg-green-100 p-2 rounded-lg text-green-600 h-12 w-11" size={33} />
          </div>

          <div className="p-2">
            <h4 className="text-gray-500 font-light">Total Suppliers</h4>
          </div>

          <div className="p-2 text-3xl font-light">
            <p>5</p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <div>
            <Users className="bg-blue-100 p-2 rounded-lg text-blue-600 h-12 w-11" size={33} />
          </div>

          <div className="p-2">
            <h4 className="text-gray-500 font-light">Active Partnerships</h4>
          </div>

          <div className="p-2 text-3xl font-light">
            <p>5</p>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <div>
            <Users className="bg-orange-100 p-2 rounded-lg text-orange-600 h-12 w-11" size={33} />
          </div>

          <div className="p-2">
            <h4 className="text-gray-500 font-light">Total Orders</h4>
          </div>

          <div className="p-2 text-3xl font-light">
            <p>209</p>
          </div>
        </div>
      </section>


      {/* Suppliers Forms */}
      <section>
  <div className="mx-8 mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* CARD 1 */}
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      {/* TOP */}
      <div className="flex items-start gap-6">
        {/* ICON BOX */}
        <div className="h-16 w-16 rounded-2xl bg-green-500 flex items-center justify-center text-white">
          <Users size={34} />
        </div>

        {/* TITLE + RATING */}
        <div className="flex-1">
          <h3 className="text-xl">Farm Fresh Suppliers</h3>
          <p className="text-gray-500">Khaalid Hashi</p>

          <div className="mt-2 flex items-center gap-2 text-gray-500">
            <Star size={18} className="text-yellow-400" fill="currentColor" />
            <span>4.8</span>
            <span>(45 orders)</span>
          </div>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="mt-6 space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <Phone size={18} />
          <span>+252 61 213 7065</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} />
          <span>khaalid@farmfresh.com</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={18} />
          <span>Mogadishu, Somalia</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-6 h-px bg-gray-100" />

      {/* PRODUCTS */}
      <div>
        <p className="text-gray-500">Products:</p>
        <p className="mt-2 text-gray-700">Apples, Bananas, Grapes</p>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="w-full rounded-xl bg-green-500 py-3 text-white hover:bg-green-600 transition-colors">
          Contact
        </button>

        <button className="w-full rounded-xl border border-green-500 py-3 text-green-600 hover:bg-green-50 transition-colors">
          View Orders
        </button>
      </div>
    </div>

    {/* CARD 2 */}
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      {/* TOP */}
      <div className="flex items-start gap-6">
        {/* ICON BOX */}
        <div className="h-16 w-16 rounded-2xl bg-green-500 flex items-center justify-center text-white">
          <Users size={34} />
        </div>

        {/* TITLE + RATING */}
        <div className="flex-1">
          <h3 className="text-xl">Tropical Imports Ltd</h3>
          <p className="text-gray-500">Mohamed Abdiaziz</p>

          <div className="mt-2 flex items-center gap-2 text-gray-500">
            <Star size={18} className="text-yellow-400" fill="currentColor" />
            <span>4.9</span>
            <span>(38 orders)</span>
          </div>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="mt-6 space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <Phone size={18} />
          <span>+252 61 090 9070</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} />
          <span>Azhari@tropicalimports.com</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={18} />
          <span>Doha, Qatar</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-6 h-px bg-gray-100" />

      {/* PRODUCTS */}
      <div>
        <p className="text-gray-500">Products:</p>
        <p className="mt-2 text-gray-700">Mangoes, Pineapples, Avocados</p>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="w-full rounded-xl bg-green-500 py-3 text-white hover:bg-green-600 transition-colors">
          Contact
        </button>

        <button className="w-full rounded-xl border border-green-500 py-3 text-green-600 hover:bg-green-50 transition-colors">
          View Orders
        </button>
      </div>
    </div>


        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      {/* TOP */}
      <div className="flex items-start gap-6">
        {/* ICON BOX */}
        <div className="h-16 w-16 rounded-2xl bg-green-500 flex items-center justify-center text-white">
          <Users size={34} />
        </div>

        {/* TITLE + RATING */}
        <div className="flex-1">
          <h3 className="text-xl">Berry Best Co.</h3>
          <p className="text-gray-500">Khadiijo Hashi</p>

          <div className="mt-2 flex items-center gap-2 text-gray-500">
            <Star size={18} className="text-yellow-400" fill="currentColor" />
            <span>4.9</span>
            <span>(38 orders)</span>
          </div>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="mt-6 space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <Phone size={18} />
          <span>+252 61 040 6889</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} />
          <span>khadiijo@tropicalimports.com</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={18} />
          <span>Dubai, UAE</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-6 h-px bg-gray-100" />

      {/* PRODUCTS */}
      <div>
        <p className="text-gray-500">Products:</p>
        <p className="mt-2 text-gray-700">Mangoes, Pineapples, Avocados</p>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="w-full rounded-xl bg-green-500 py-3 text-white hover:bg-green-600 transition-colors">
          Contact
        </button>

        <button className="w-full rounded-xl border border-green-500 py-3 text-green-600 hover:bg-green-50 transition-colors">
          View Orders
        </button>
      </div>
    </div>

        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      {/* TOP */}
      <div className="flex items-start gap-6">
        {/* ICON BOX */}
        <div className="h-16 w-16 rounded-2xl bg-green-500 flex items-center justify-center text-white">
          <Users size={34} />
        </div>

        {/* TITLE + RATING */}
        <div className="flex-1">
          <h3 className="text-xl">Citrus Valley</h3>
          <p className="text-gray-500">Ishak Abdiaziz</p>

          <div className="mt-2 flex items-center gap-2 text-gray-500">
            <Star size={18} className="text-yellow-400" fill="currentColor" />
            <span>4.9</span>
            <span>(38 orders)</span>
          </div>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="mt-6 space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <Phone size={18} />
          <span>+252 61 090 9060</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} />
          <span>ishak@tropicalimports.com</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={18} />
          <span>Johansberg, South Africa</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-6 h-px bg-gray-100" />

      {/* PRODUCTS */}
      <div>
        <p className="text-gray-500">Products:</p>
        <p className="mt-2 text-gray-700">Mangoes, Pineapples, Avocados</p>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="w-full rounded-xl bg-green-500 py-3 text-white hover:bg-green-600 transition-colors">
          Contact
        </button>

        <button className="w-full rounded-xl border border-green-500 py-3 text-green-600 hover:bg-green-50 transition-colors">
          View Orders
        </button>
      </div>
    </div>

        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      {/* TOP */}
      <div className="flex items-start gap-6">
        {/* ICON BOX */}
        <div className="h-16 w-16 rounded-2xl bg-green-500 flex items-center justify-center text-white">
          <Users size={34} />
        </div>

        {/* TITLE + RATING */}
        <div className="flex-1">
          <h3 className="text-xl">Organic Harvest Co.</h3>
          <p className="text-gray-500">Yasiin Mohamed Yusuf</p>

          <div className="mt-2 flex items-center gap-2 text-gray-500">
            <Star size={18} className="text-yellow-400" fill="currentColor" />
            <span>4.9</span>
            <span>(38 orders)</span>
          </div>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="mt-6 space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <Phone size={18} />
          <span>+252 62 5940360</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} />
          <span>yasiin@tropicalimports.com</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={18} />
          <span>Silicon Valley, USA</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-6 h-px bg-gray-100" />

      {/* PRODUCTS */}
      <div>
        <p className="text-gray-500">Products:</p>
        <p className="mt-2 text-gray-700">Mangoes, Pineapples, Avocados</p>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="w-full rounded-xl bg-green-500 py-3 text-white hover:bg-green-600 transition-colors">
          Contact
        </button>

        <button className="w-full rounded-xl border border-green-500 py-3 text-green-600 hover:bg-green-50 transition-colors">
          View Orders
        </button>
      </div>
    </div>
    
  </div>
</section>
    
    
    </>
  )
}
