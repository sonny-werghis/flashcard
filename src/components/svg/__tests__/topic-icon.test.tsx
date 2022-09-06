import React from 'react';
import { render } from '@testing-library/react-native';
import { TopicIcon } from '../topic-icon';
import { WHITE } from '@constants/colors';

describe('TopicIcon', () => {
  it('should match snapshot', () => {
    const tree = render(<TopicIcon focused={true} color={WHITE} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
