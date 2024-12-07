import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Page from '../page'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ imageUrl: 'mock-image-url' }),
  })
) as jest.Mock

describe('Home Page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear()
  })

  it('should render form inputs', () => {
    render(<Page />)
    
    expect(screen.getByLabelText(/mood/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/energy/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/focus/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/colors/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/complexity/i)).toBeInTheDocument()
  })

  it('should generate image when form is submitted', async () => {
    render(<Page />)
    
    // Fill out the form
    await userEvent.selectOptions(screen.getByLabelText(/mood/i), 'calm')
    await userEvent.selectOptions(screen.getByLabelText(/energy/i), 'balanced')
    await userEvent.selectOptions(screen.getByLabelText(/focus/i), 'meditation')
    await userEvent.selectOptions(screen.getByLabelText(/colors/i), 'earth')
    await userEvent.selectOptions(screen.getByLabelText(/complexity/i), 'medium')

    // Submit the form
    const generateButton = screen.getByRole('button', { name: /generate/i })
    await userEvent.click(generateButton)

    // Check if fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood: 'calm',
        energy: 'balanced',
        focus: 'meditation',
        colors: 'earth',
        complexity: 'medium'
      }),
    })

    // Wait for the image to be displayed
    await waitFor(() => {
      expect(screen.getByAltText(/generated mandala/i)).toBeInTheDocument()
    })
  })

  it('should show loading state while generating', async () => {
    // Mock a delayed response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      new Promise((resolve) =>
        setTimeout(() =>
          resolve({
            ok: true,
            json: () => Promise.resolve({ imageUrl: 'mock-image-url' }),
          }),
          1000
        )
      )
    )

    render(<Page />)
    
    // Submit the form
    const generateButton = screen.getByRole('button', { name: /generate/i })
    await userEvent.click(generateButton)

    // Check for loading state
    expect(screen.getByText(/generating/i)).toBeInTheDocument()

    // Wait for the image
    await waitFor(() => {
      expect(screen.getByAltText(/generated mandala/i)).toBeInTheDocument()
    })
  })

  it('should handle API errors', async () => {
    // Mock an error response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal Server Error' }),
      })
    )

    render(<Page />)
    
    // Submit the form
    const generateButton = screen.getByRole('button', { name: /generate/i })
    await userEvent.click(generateButton)

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
