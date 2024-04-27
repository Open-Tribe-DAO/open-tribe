import Link from "next/link"

interface CommunityCardProps {
  id: string
  name: string
  image?: string
}

export const CommunityCard = ({ id, name, image }: CommunityCardProps) => {
  return (
    <Link href={`community/${id}`} className="border-2 border-solid border-gray-300 rounded-md flex h-[80px] w-full">
      <div className="w-[100px]">
        <img src={image} />
      </div>
      <div className="p-[5px]">
        <p className="text-lg">{name}</p>
      </div>
    </Link>
  )
}