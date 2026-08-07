const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌺 Creating & Assigning Pt. Mukesh Bohra in DB...')

  // Create User profile for Pt. Mukesh Bohra if not existing
  const email = 'mukesh.bohra@divyayagyam.com'
  let user = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone: '+919587171984' }] }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        phone: '+919587171984',
        fullName: 'पं. मुकेश बोहरा (Pt. Mukesh Bohra)',
        firstName: 'मुकेश',
        lastName: 'बोहरा',
        avatar: '/pandit_mukesh_bohra.jpg',
        status: 'ACTIVE'
      }
    })
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: 'पं. मुकेश बोहरा (Pt. Mukesh Bohra)',
        avatar: '/pandit_mukesh_bohra.jpg'
      }
    })
  }

  // Create or Update Pandit record
  let pandit = await prisma.pandit.findUnique({
    where: { userId: user.id }
  })

  const panditData = {
    userId: user.id,
    bio: 'मुख्य पीठाधीश्वर व वेदाचार्य - माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)। 25+ वर्षों का कर्मकांड, नवार्ण महायज्ञ, बगलामुखी तीक्ष्ण हवन व महाविद्या अनुष्ठान का सिद्ध अनुभव।',
    experience: 25,
    specialization: ['दुर्गा सप्तशती सम्पुट पाठ', 'बगलामुखी मिर्ची हवन', 'महाविद्या अनुष्ठान', 'वैदिक तंत्रोक्त महायज्ञ'],
    languages: ['Hindi', 'Sanskrit', 'Rajasthani'],
    rating: 4.95,
    totalBookings: 10000,
    isVerified: true,
    isActive: true,
    isVideoEnabled: true
  }

  if (!pandit) {
    pandit = await prisma.pandit.create({ data: panditData })
  } else {
    pandit = await prisma.pandit.update({
      where: { id: pandit.id },
      data: panditData
    })
  }

  // Update Pujas in Jodhpur Shakti Peeth to assign Pt. Mukesh Bohra
  const updatedPujas = await prisma.puja.updateMany({
    where: {
      OR: [
        { slug: 'maa-bagalamukhi-mirchi-hawan' },
        { slug: 'durga-saptashati-108-samagri-mahayagya' },
        { location: { contains: 'Jodhpur' } }
      ]
    },
    data: {
      procedure: 'मुख्य पीठाधीश्वर पं. मुकेश बोहरा (जोधपुर) द्वारा सस्वर सम्पुट पाठ, 108 सामग्री महाहवन व लाइव वीडियो संकल्प।'
    }
  })

  console.log('🎉 SUCCESS! Registered Pt. Mukesh Bohra (ID:', pandit.id, ') & updated', updatedPujas.count, 'Pujas in DB!')
}

main()
  .catch(err => {
    console.error('❌ Error creating Pandit:', err)
  })
  .finally(() => prisma.$disconnect())
