'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';

interface Project {
  type: string;
  title: string;
  company: string;
  readTime: string;
  action: string;
  actionLink?: string;
}

const projects: Project[] = [
  {
    type: 'Website',
    title: 'Boosting adoption of onchain wallet verifications',
    company: 'Coinbase',
    readTime: '8 min read',
    action: 'Request view access',
    actionLink: '#',
  },
  {
    type: 'Mobile app',
    title: 'Enabling a NFT claiming success rate of 98%',
    company: 'NFT Labs',
    readTime: '6 min read',
    action: 'View case study',
    actionLink: '#',
  },
  {
    type: 'Website',
    title: 'Designing a landing page for a virtual marathon',
    company: 'Conceptual',
    readTime: '10 min read',
    action: 'View case study',
    actionLink: '#',
  },
];

export default function SelectedWork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-12"
        >
          Selected Work
        </motion.h2>
        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-b-0"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    {project.type}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {project.company} · {project.readTime}
                  </p>
                </div>
                <a
                  href={project.actionLink || '#'}
                  className="flex items-center gap-2 text-gray-900 dark:text-white hover:underline font-medium"
                >
                  {project.action}
                  <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
