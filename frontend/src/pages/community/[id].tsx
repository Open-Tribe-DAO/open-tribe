
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Layout } from '~/components/Layout';
import { api } from "~/utils/api";
import Image from 'next/image';
import communityLogo from './../../../public/eth.png';

export default function TicketDetailsPage() {
  const router = useRouter();
  const contractAddress = Array.isArray(router.query.contractAddress) ? router.query.contractAddress[0] : router.query.contractAddress;
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const { data: community } = api.community.getOne.useQuery({ id: `${id}` })

  console.log('community', community);

  return (
    <Layout >
      <div className="px-[10px] mt-[30px] text-white">
        <h1 className='text-3xl'>{community?.name}</h1>
        <p className='text-lg'>{community?.description}</p>
        <Image 
        src={communityLogo}
        alt={'Community Logo'}
        width={500}
        height={500} />
        {community?.owner && <p>Owner: {community?.owner}</p>}


        <div className='mt-[20px]'>
        <h2 className='text-2xl'>Tasks</h2>

        </div>
      </div>
    </Layout>
  );
}
