import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { gitlabPlugin, EntityGitlabContent } from '../src/plugin';

createDevApp()
  .registerPlugin(gitlabPlugin)
  .addPage({
    element: <EntityGitlabContent />,
    title: 'Root Page',
    path: '/backstage-plugin-gitlab'
  })
  .render();
