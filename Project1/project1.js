// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
	let size = fgImg.width * fgImg.height;
	let bg_offset = 0;
	let fg_offset = 0;
	let i_offset = 0;
	let j_offset = 0;
	if(fgPos.x > 0) {
		bg_offset += fgPos.x;
		if(fgPos.x + fgImg.width >= bgImg.width) {
			j_offset = -(fgPos.x + fgImg.width - bgImg.width);
		}
	}
	else {
		fg_offset += -fgPos.x
	}
	if(fgPos.y > 0) {
		bg_offset += fgPos.y * bgImg.width;
		if(fgPos.y + fgImg.height >= bgImg.height) {
			i_offset = -(fgPos.y + fgImg.height - bgImg.height);
		}
	}
	else {
		fg_offset += -fgPos.y * fgImg.width;
	}
	
	for(let i = 0; i < fgImg.height + i_offset; i++) {
		for(let j = 0; j < fgImg.width + j_offset; j++) {
			let fg_pos = 4 * (i * fgImg.width + j + fg_offset);
			let bg_pos = 4 * (i * bgImg.width + j + bg_offset);
			bgImg.data[bg_pos] = fgOpac * fgImg.data[fg_pos] + (1 - fgOpac) * bgImg.data[bg_pos];
			bgImg.data[bg_pos + 1] = fgOpac * fgImg.data[fg_pos + 1] + (1 - fgOpac) * bgImg.data[bg_pos + 1];
			bgImg.data[bg_pos + 2] = fgOpac * fgImg.data[fg_pos + 2] + (1 - fgOpac) * bgImg.data[bg_pos + 2];
		}
	}
}
