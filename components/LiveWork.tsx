'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';

interface LiveProject {
  title: string;
  description: string;
  link: string;
}

const liveProjects: LiveProject[] = [
  {
    title: 'Ultimate digits',
    description: 'Designing & developing a landing page',
    link: '#',
  },
  {
    title: 'Coinbase developer platform',
    description: 'Product page for onchain verifications',
    link: '#',
  },
  {
    title: 'Web3 number alliance',
    description: 'Landing page for W3NA callout',
    link: '#',
  },
];

export default function LiveWork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-medium text-gray-900 mb-12"
        >
          Live Work
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {liveProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:underline">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {project.description}
                </p>
                <span className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
                  Live site
                  <ExternalLink size={14} />
                </span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
