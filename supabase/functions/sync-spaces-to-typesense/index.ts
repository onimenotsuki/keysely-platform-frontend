import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Typesense from 'npm:typesense'

const TYPESENSE_HOST = Deno.env.get('TYPESENSE_HOST')
const TYPESENSE_API_KEY = Deno.env.get('TYPESENSE_API_KEY')
const TYPESENSE_COLLECTION_NAME = 'spaces'

interface SupabaseSpace {
  id: string
  title: string
  description: string
  address: string
  city: string
  address_object?: {
    state?: string
    [key: string]: unknown
  } | null
  price_per_hour: number
  currency: string
  capacity: number
  area_sqm?: number
  images?: string[]
  features?: string[]
  amenities?: string[]
  is_active: boolean
  rating?: number
  total_reviews?: number
  category_id?: string
  owner_id: string
  latitude?: number
  longitude?: number
}

serve(async (req) => {
  try {
    if (!TYPESENSE_HOST || !TYPESENSE_API_KEY) {
      console.error('Typesense not configured')
      return new Response(JSON.stringify({ message: 'Typesense not configured' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const client = new Typesense.Client({
      nodes: [
        {
          host: TYPESENSE_HOST,
          port: 8108,
          protocol: 'http',
        },
      ],
      apiKey: TYPESENSE_API_KEY,
      connectionTimeoutSeconds: 2,
    })

    const payload = await req.json()
    const { type, table, record, old_record } = payload

    // Only process spaces table
    if (table !== 'spaces') {
      return new Response(JSON.stringify({ message: 'Not a spaces record' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    console.log(`Processing ${type} event for space ${record?.id || old_record?.id}`)

    if (type === 'INSERT' || type === 'UPDATE') {
      const space = record as SupabaseSpace
      const state = space.address_object?.state || undefined

      const document = {
        id: space.id, // Typesense uses 'id' as the document identifier
        title: space.title,
        description: space.description,
        address: space.address,
        city: space.city,
        state: state,
        price_per_hour: space.price_per_hour,
        currency: space.currency || 'MXN',
        capacity: space.capacity,
        area_sqm: space.area_sqm,
        images: space.images || [],
        features: space.features || [],
        amenities: space.amenities || [],
        is_active: space.is_active,
        rating: space.rating || 0,
        total_reviews: space.total_reviews || 0,
        category_id: space.category_id,
        owner_id: space.owner_id,
        // Typesense geopoint format: [lat, lng]
        location: (space.latitude && space.longitude) ? [space.latitude, space.longitude] : undefined,
      }

      // Use upsert to handle both insert and update
      await client.collections(TYPESENSE_COLLECTION_NAME).documents().upsert(document)
      console.log(`Successfully indexed space ${space.id}`)

    } else if (type === 'DELETE') {
      const id = old_record.id
      try {
        await client.collections(TYPESENSE_COLLECTION_NAME).documents(id).delete()
        console.log(`Successfully deleted space ${id} from Typesense`)
      } catch (error) {
        // Ignore 404 errors when deleting
        if (error.httpStatus !== 404) {
          throw error
        }
        console.log(`Space ${id} was already deleted or not found in Typesense`)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error syncing to Typesense:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
