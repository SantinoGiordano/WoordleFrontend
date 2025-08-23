'use client'

import { User } from '@/types/types';
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [items, setItems] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((userInfo: User[]) => {
        setItems(userInfo);
      });
  }, []);

  return (
    <div>
      <h1>Leaderboards Page</h1>
      {items.map((item) => (
        <div key={item._id}>{item.username}</div>
      ))}
    </div>
  );
};

export default Page;