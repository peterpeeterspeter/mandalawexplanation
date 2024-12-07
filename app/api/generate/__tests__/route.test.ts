import { POST } from '../route'

// Mock Replicate
jest.mock('replicate', () => {
  return jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue(['mock-image-url'])
  }))
})

describe('Generate API', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    process.env.REPLICATE_API_TOKEN = 'test-token'
  })

  it('should generate an image with valid parameters', async () => {
    const mockRequest = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        mood: 'calm',
        energy: 'balanced',
        focus: 'meditation',
        colors: 'earth',
        complexity: 'medium'
      })
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('imageUrl')
  })

  it('should handle missing parameters', async () => {
    const mockRequest = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(400)
  })

  it('should handle invalid mood parameter', async () => {
    const mockRequest = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        mood: 'invalid',
        energy: 'balanced',
        focus: 'meditation',
        colors: 'earth',
        complexity: 'medium'
      })
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200) // The API handles invalid parameters gracefully
    expect(data).toHaveProperty('imageUrl')
  })
})
