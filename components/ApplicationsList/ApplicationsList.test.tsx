import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApplicationsList from './ApplicationsList';
import { fetchApplications } from '../../utils/api/applications';
jest.mock('next/router', () => ({
  push: jest.fn(),
  useRouter: () => ({
    asPath: '/',
  }),
}));
jest.mock('../../utils/api/grantOfficers', () => {
  return {
    fetchGrantOfficers: async () => {
      return {
        grantOfficers: [],
      };
    },
  };
});
jest.mock('../../utils/api/applications', () => ({
  fetchApplications: jest.fn(() =>
    Promise.resolve({ applications: [], pagination: { totalPages: 1 } })
  ),
}));

const defaultProps = {
  grantType: 'arg',
  page: 1,
  pageSize: 10,
  sort: '+applicationDate',
  status: undefined,
  grantOfficer: undefined,
  businessCategory: undefined,
  businessSize: undefined,
  businessPremises: undefined,
  applicationId: undefined,
  searchTerm: undefined,
  groups: [],
  csvDownloadGroup: undefined,
};

describe('<ApplicationsList />', () => {
  it('should render the search, filters, and results table', async () => {
    const { asFragment } = render(<ApplicationsList {...defaultProps} />);

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('should show a loading message while the results are pending', async () => {
    render(<ApplicationsList {...defaultProps} />);

    await waitFor(() => {
      screen.getByText('Loading...');
    });
  });

  it('should show the applications in the table once they have loaded', async () => {
    (fetchApplications as jest.Mock).mockResolvedValue({
      applications: [
        {
          businessName: 'Test business name',
          clientGeneratedId: 'client-generated-id',
          applicationDate: new Date('2022-01-01').toLocaleString(),
          status: 'Unprocessed',
        },
      ],
      pagination: {
        totalPages: 1,
      },
    });
    render(<ApplicationsList {...defaultProps} />);

    await waitFor(() => {
      screen.getByText('Test business name');
    });
  });

  it('should fetch new applications using the inputted search term when the search button is pressed', async () => {
    render(<ApplicationsList {...defaultProps} />);

    await waitFor(() => {
      screen.getByText('Loading...');
    });

    userEvent.type(screen.getByLabelText('Search'), 'some search term');
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(fetchApplications).toHaveBeenCalledWith(
        expect.objectContaining({
          searchTerm: 'some search term',
        })
      );
    });
  });
});
