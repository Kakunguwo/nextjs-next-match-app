import React from 'react'
import ListsTabs from './ListsTabs'
import { fetchCurrentLikeIds, fetchLikes } from '../actions/likeActions'

export default async function ListsPage({searchParams}: {searchParams: {type: string}}) {
  const likedIds = await fetchCurrentLikeIds();
  const members = await fetchLikes(searchParams.type);
  return (
    <div>
      <ListsTabs members={members} likedIds={likedIds}/>
    </div>
  )
}
