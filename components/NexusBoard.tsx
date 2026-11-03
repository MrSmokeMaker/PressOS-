// components/NexusBoard.tsx
import React, { useEffect, useState } from 'react';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { supabase } from '../utils/supabaseClient';
import type { Evidence } from '../store/store';

interface NodeProps {
  evidence: Evidence;
  onConnect: (fromId: string, toId: string) => void;
}

const Node: React.FC<NodeProps> = ({ evidence, onConnect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EVIDENCE',
    item: { id: evidence.id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'EVIDENCE',
    drop: (item: any) => {
      if (item.id !== evidence.id) onConnect(item.id, evidence.id);
    },
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        border: '1px solid #555',
        padding: '8px',
        margin: '4px',
        background: isDragging ? '#222' : '#111',
        color: '#fff',
        cursor: 'move',
      }}
    >
      {evidence.title}
    </div>
  );
};

export const NexusBoard: React.FC = () => {
  const [evidences, setEvidences] = useState<Evidence[]>([]);

  // Load evidences from Supabase
  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from('evidence').select('*');
      if (!error && data) setEvidences(data as Evidence[]);
    };
    fetch();
    // realtime updates
    const subscription = supabase
      .channel('public:evidence')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'evidence' }, () => {
        fetch();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleConnect = async (fromId: string, toId: string) => {
    const res = await fetch('/api/validateBoard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': supabase.auth.user()?.id || '',
      },
      body: JSON.stringify({ fromId, toId }),
    });
    const result = await res.json();
    if (!res.ok) alert(`Ошибка: ${result.error}`);
    else alert('Связь создана');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', flexWrap: 'wrap', background: '#0a0a0a', padding: '12px' }}>
        {evidences.map((e) => (
          <Node key={e.id} evidence={e} onConnect={handleConnect} />
        ))}
      </div>
    </DndProvider>
  );
};
