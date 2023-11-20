import { Link } from 'react-router-dom';

const Public = () => {
	const content = (
		<section className='public'>
			<header>
				<h1>
					Welcome to <span className='nowrap'>Mech Repairs</span>{' '}
				</h1>
			</header>
			<main className='public__main'>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta ducimus
					et, amet eaque{' '}
				</p>
				<address className='public__addr'>
					Mech Repairs <br />
					555 Roundo Drive
					<br />
					Manchester. ME12 4PB
					<br />
					<a href='tel: +01452 658 455'> (01452) 7899 5§7 </a>
				</address>
				<br />
				<p> Owner: Raheem Azeem</p>
			</main>
			<footer>
				<Link to='/login'>Employee Login</Link>
			</footer>
		</section>
	);
	return content;
};

export default Public;
