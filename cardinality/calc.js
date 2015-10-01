( function( $ ) {
"use strict";

// [0, u] 구간을 n 등분하여 가우스 적분을 근사한다.
function gauss_int( n, u ) {
	// 분할 구간 크기
	var w = u / n;
	var r = Math.pow( Math.E, w * w * -1 );
	var S = 0;

	for ( var i = 1; i <= n; i++ ) {
		S += Math.pow( r, i * i );
	}

	return S * w;
}

// 표준정규분포를 따르는 확률 변수 Z 에 대하여 P ( 0 <= Z <= u ) 의 값을
// 정확도 n 에 따라 근사합니다. 여기에서 n 은 guess_int 에서의 n 과 같다.
function PN( n, u ) {
	return gauss_int( n, u / Math.sqrt( 2 ) ) / Math.sqrt( Math.PI );
}

function solve_quadratic( a, b, c ) {
	var D = b * b - 4 * a * c;
	if ( D < 0 ) {
		throw Error( "quadratic equation does not have real root" );
	}

	var rD = Math.sqrt( D );

	return [ - (b + rD) / ( 2 * a ), (rD - b) / (2 * a ) ];
}

// P(|Z| <= k)
// n(A) = a
// n(A and B) = r
// n(B) = N
function guess_cardinality( k, a, r, N ) {
	return solve_quadratic(
		r * r,
		- N * a * (2 * r + k * k),
		N * a * a * (N + k * k)
	);
}

function vars() {
	return {
		a: parseInt( $( "input.a" ).val(), 10),
		r: parseInt( $( "input.r" ).val(), 10),
		N: parseInt( $( "input.N" ).val(), 10)
	};
}

var NDT = {};
var output = $( "#output" );

(function() {
	for ( var i = 0; i < 500; i++ ) {
		var k = 0.01 * i;
		var p = PN( 10000, k ) * 2;
		NDT[k] = p;
	}
})();

function display( k, v ) {
	var sec = guess_cardinality( k, v.a, v.r, v.N );
	var text = "P([" + sec[0] + ", " + sec[1] + "]) = " + NDT[k] * 100;
	$( "<div>" ).text( text ).appendTo( output );
}

$( ".number" ).change(function() {
	var v = vars();
	output.empty();

	try {
		if ( v.a > 0 && v.r > 0 && v.N > 0 ) {
			display( 1.96, v );
			display( 2.58, v );

			for ( var i = 0; i < 500; i++ ) {
				var k = 0.01 * i;
				display( k, v );
			}
		}
	}
	catch (e) {

	}
});

} )( jQuery );
