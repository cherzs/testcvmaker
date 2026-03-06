import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Data fallback yang lebih lengkap untuk demo
const FALLBACK_JOBS = [
  {
    id: 'job-1',
    title: 'Software Engineer',
    company_name: 'Google Indonesia',
    location: 'Jakarta, Indonesia',
    description: 'We are looking for a skilled Software Engineer to join our team. You will be responsible for developing high-quality applications, collaborating with cross-functional teams, and mentoring junior developers.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '2 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-2',
    title: 'Frontend Developer',
    company_name: 'Tokopedia',
    location: 'Jakarta, Indonesia',
    description: 'Join our frontend team to build scalable web applications. Experience with React, TypeScript, and Next.js is required. Knowledge of Tailwind CSS is a plus.',
    via: 'JobStreet',
    share_link: 'https://www.jobstreet.co.id/',
    detected_extensions: {
      posted_at: '1 day ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-3',
    title: 'Backend Developer',
    company_name: 'Gojek',
    location: 'Jakarta, Indonesia',
    description: 'Build and maintain high-performance backend services. Strong experience with Go, Java, or Node.js required. Experience with microservices architecture is preferred.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '3 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-4',
    title: 'UI/UX Designer',
    company_name: 'Traveloka',
    location: 'Jakarta, Indonesia',
    description: 'Design user-centered experiences for millions of users. Proficiency in Figma, Adobe XD, and prototyping tools required. Portfolio demonstrating strong design thinking is essential.',
    via: 'Glints',
    share_link: 'https://glints.com/',
    detected_extensions: {
      posted_at: '5 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-5',
    title: 'Product Manager',
    company_name: 'Shopee Indonesia',
    location: 'Jakarta, Indonesia',
    description: 'Lead product development from ideation to launch. Strong analytical skills, experience with data-driven decision making, and ability to work with cross-functional teams.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '1 week ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-6',
    title: 'Data Analyst',
    company_name: 'Grab Indonesia',
    location: 'Jakarta, Indonesia',
    description: 'Analyze large datasets to provide actionable insights. Proficiency in SQL, Python, and data visualization tools. Experience with BigQuery or similar technologies is a plus.',
    via: 'Indeed',
    share_link: 'https://www.indeed.com/',
    detected_extensions: {
      posted_at: '4 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-7',
    title: 'DevOps Engineer',
    company_name: 'Bukalapak',
    location: 'Jakarta, Indonesia',
    description: 'Manage cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, Kubernetes, and Terraform required. Strong scripting skills in Python or Bash.',
    via: 'JobStreet',
    share_link: 'https://www.jobstreet.co.id/',
    detected_extensions: {
      posted_at: '6 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-8',
    title: 'Mobile Developer (iOS)',
    company_name: 'OVO',
    location: 'Jakarta, Indonesia',
    description: 'Develop and maintain iOS applications for millions of users. Strong experience with Swift and iOS SDK. Experience with RxSwift or Combine is a plus.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '2 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-9',
    title: 'Mobile Developer (Android)',
    company_name: 'Dana Indonesia',
    location: 'Jakarta, Indonesia',
    description: 'Build high-performance Android applications. Proficiency in Kotlin and Android Jetpack components. Experience with coroutines and modern Android architecture.',
    via: 'Glints',
    share_link: 'https://glints.com/',
    detected_extensions: {
      posted_at: '1 week ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-10',
    title: 'Full Stack Developer',
    company_name: 'Xendit',
    location: 'Jakarta, Indonesia',
    description: 'Work on both frontend and backend systems. Experience with React, Node.js, and PostgreSQL. Ability to work in a fast-paced startup environment.',
    via: 'Indeed',
    share_link: 'https://www.indeed.com/',
    detected_extensions: {
      posted_at: '3 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-11',
    title: 'Machine Learning Engineer',
    company_name: 'ByteDance (TikTok)',
    location: 'Singapore (Remote)',
    description: 'Develop ML models for recommendation systems. Strong background in machine learning, deep learning, and Python. Experience with TensorFlow or PyTorch required.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '5 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-12',
    title: 'QA Engineer',
    company_name: 'Blibli',
    location: 'Jakarta, Indonesia',
    description: 'Ensure quality of web and mobile applications. Experience with automated testing frameworks like Selenium, Cypress, or Appium. Strong attention to detail.',
    via: 'JobStreet',
    share_link: 'https://www.jobstreet.co.id/',
    detected_extensions: {
      posted_at: '1 week ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-13',
    title: 'Technical Lead',
    company_name: 'Sea Limited (Shopee)',
    location: 'Singapore',
    description: 'Lead a team of engineers to build scalable systems. Strong technical background, experience with system design, and leadership skills required.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '4 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-14',
    title: 'Security Engineer',
    company_name: 'Mandiri Bank',
    location: 'Jakarta, Indonesia',
    description: 'Protect systems and data from security threats. Experience with penetration testing, security audits, and compliance. Certifications like CEH or CISSP are a plus.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '2 weeks ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-15',
    title: 'Cloud Architect',
    company_name: 'Telkom Indonesia',
    location: 'Bandung, Indonesia',
    description: 'Design and implement cloud infrastructure solutions. Deep knowledge of AWS, Azure, or GCP. Experience with infrastructure as code and containerization.',
    via: 'JobStreet',
    share_link: 'https://www.jobstreet.co.id/',
    detected_extensions: {
      posted_at: '1 week ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-16',
    title: 'React Native Developer',
    company_name: 'Ajaib',
    location: 'Jakarta, Indonesia',
    description: 'Build cross-platform mobile applications. Strong experience with React Native, JavaScript, and mobile app deployment. Experience with financial apps is a plus.',
    via: 'Glints',
    share_link: 'https://glints.com/',
    detected_extensions: {
      posted_at: '3 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-17',
    title: 'Data Engineer',
    company_name: 'Kredivo',
    location: 'Jakarta, Indonesia',
    description: 'Build data pipelines and infrastructure. Experience with Apache Airflow, Spark, and data warehousing. Strong SQL skills and Python programming.',
    via: 'Indeed',
    share_link: 'https://www.indeed.com/',
    detected_extensions: {
      posted_at: '6 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-18',
    title: 'System Administrator',
    company_name: 'Indosat Ooredoo',
    location: 'Jakarta, Indonesia',
    description: 'Manage and maintain IT infrastructure. Experience with Linux, Windows Server, and network administration. Certifications like RHCE or MCSA are preferred.',
    via: 'JobStreet',
    share_link: 'https://www.jobstreet.co.id/',
    detected_extensions: {
      posted_at: '2 weeks ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-19',
    title: 'Frontend Engineer',
    company_name: 'Payfazz',
    location: 'Jakarta, Indonesia',
    description: 'Create beautiful and responsive web interfaces. Strong experience with React, CSS, and modern frontend tooling. Experience with design systems is a plus.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '1 day ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-20',
    title: 'Backend Engineer (Go)',
    company_name: 'Midtrans',
    location: 'Jakarta, Indonesia',
    description: 'Build high-performance payment systems. Strong experience with Go, microservices, and distributed systems. Knowledge of payment gateways is beneficial.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '4 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-21',
    title: 'UX Researcher',
    company_name: 'Ruangguru',
    location: 'Jakarta, Indonesia',
    description: 'Conduct user research to inform product decisions. Experience with qualitative and quantitative research methods. Strong analytical and communication skills.',
    via: 'Glints',
    share_link: 'https://glints.com/',
    detected_extensions: {
      posted_at: '1 week ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-22',
    title: 'Blockchain Developer',
    company_name: 'PINTU',
    location: 'Jakarta, Indonesia',
    description: 'Develop blockchain-based applications and smart contracts. Experience with Solidity, Web3.js, and Ethereum. Knowledge of DeFi is a plus.',
    via: 'Indeed',
    share_link: 'https://www.indeed.com/',
    detected_extensions: {
      posted_at: '5 days ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-23',
    title: 'Technical Writer',
    company_name: 'Accenture Indonesia',
    location: 'Jakarta, Indonesia',
    description: 'Create technical documentation for APIs and products. Strong writing skills and ability to explain complex concepts simply. Experience with developer documentation tools.',
    via: 'JobStreet',
    share_link: 'https://www.jobstreet.co.id/',
    detected_extensions: {
      posted_at: '2 weeks ago',
      schedule_type: 'Full-time'
    }
  },
  {
    id: 'job-24',
    title: 'Site Reliability Engineer',
    company_name: 'Netflix',
    location: 'Singapore (Remote)',
    description: 'Ensure reliability and performance of large-scale systems. Experience with monitoring, alerting, and incident response. Strong programming skills in Python or Go.',
    via: 'LinkedIn',
    share_link: 'https://www.linkedin.com/jobs/',
    detected_extensions: {
      posted_at: '3 days ago',
      schedule_type: 'Full-time'
    }
  }
];

export async function GET(request: Request) {
  try {
    // Check session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const totalJobs = FALLBACK_JOBS.length;
    const totalPages = Math.ceil(totalJobs / limit);
    
    // Get jobs for current page
    const paginatedJobs = FALLBACK_JOBS.slice(startIndex, endIndex);

    return NextResponse.json({
      jobs: paginatedJobs,
      pagination: {
        page,
        limit,
        totalJobs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
