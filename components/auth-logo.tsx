'use client'

import Image from 'next/image'

export function AuthLogo() {
  return (
    <div className="flex flex-col items-center space-y-2 mb-6">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/046/923/957/small_2x/cube-logo-geometric-design-black-and-white-box-logotype-company-trendy-techno-emblem-in-isometric-3d-style-vector.jpg"
        alt="Company Logo"
        width={64}
        height={64}
        className="rounded-lg"
      />
      <h1 className="text-2xl font-bold">SecurePass</h1>
    </div>
  )
}