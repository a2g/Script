import { html, TemplateResult } from 'lit';
import '../src/main/jigsaw-w.js';

export default {
  title: 'JigsawW',
  component: 'jigsaw-w',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ title, backgroundColor = 'white' }: ArgTypes) => html`
  <jigsaw-w style="--jigsaw-w-background-color: ${backgroundColor}" .title=${title}></jigsaw-w>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
