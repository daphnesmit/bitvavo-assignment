import { render } from '../../../tests/testUtils';
import { Loader } from '../Loader';

describe('Loader', () => {
  it('renders correctly', () => {
    const { container } = render(<Loader />);
    expect(container).toMatchSnapshot();
  });
});
