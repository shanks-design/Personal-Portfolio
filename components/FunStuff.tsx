'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FunStuff() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              I find joy in crafting experiences that go beyond mere usability, creating connections
              between people and bringing delight to the often dull digital world
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              When I am not designing or doom scrolling, I like playing 🎾 tennis, catching Pokémon, and brewing coffee
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-6">
              Some fun stuff :)
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
                  Books
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-500">Reading</span>
                    <span className="text-gray-900 dark:text-white">Read Write Own</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">by Chris Dixon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-500">Next</span>
                    <span className="text-gray-900 dark:text-white">Creative Act</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">by Rick Rubin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
